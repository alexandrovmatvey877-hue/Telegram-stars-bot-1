const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "white-stars-super-admin";

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ===== ИНИЦИАЛИЗАЦИЯ БД =====
(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            telegram_id TEXT UNIQUE,
            username TEXT,
            first_name TEXT,
            last_name TEXT,
            avatar TEXT,
            balance DOUBLE PRECISION DEFAULT 0,
            stars INTEGER DEFAULT 0,
            registered_at BIGINT,
            last_seen BIGINT,
            total_spent DOUBLE PRECISION DEFAULT 0,
            total_deposit DOUBLE PRECISION DEFAULT 0,
            referral_count INTEGER DEFAULT 0,
            referrer_id TEXT
        );
    `);

    // Добавляем поле stars, если его нет
    await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0
    `);

    console.log("PostgreSQL подключена");
})();

// ===== ПРОВЕРКА СТАТУСА =====
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "3.0.0"
    });
});

// ===== РЕГИСТРАЦИЯ =====
app.post("/register", async (req, res) => {
    try {
        let {
            telegram_id,
            username,
            first_name,
            last_name,
            avatar
        } = req.body;

        telegram_id = String(telegram_id).replace(".0", "");

        if (!telegram_id) {
            return res.status(400).json({
                error: "telegram_id is required"
            });
        }

        const existing = await pool.query(
            "SELECT * FROM users WHERE telegram_id = $1",
            [telegram_id]
        );

        if (existing.rows.length > 0) {
            const result = await pool.query(
                `UPDATE users
                 SET username=$1,
                     first_name=$2,
                     last_name=$3,
                     avatar=$4,
                     last_seen=$5
                 WHERE telegram_id=$6
                 RETURNING *`,
                [
                    username,
                    first_name,
                    last_name,
                    avatar,
                    Date.now(),
                    telegram_id
                ]
            );
            return res.json({
                success: true,
                user: result.rows[0]
            });
        }

        const result = await pool.query(
            `INSERT INTO users
            (
                telegram_id,
                username,
                first_name,
                last_name,
                avatar,
                balance,
                stars,
                registered_at,
                last_seen
            )
            VALUES
            ($1,$2,$3,$4,$5,0,0,$6,$7)
            RETURNING *`,
            [
                telegram_id,
                username,
                first_name,
                last_name,
                avatar,
                Date.now(),
                Date.now()
            ]
        );

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

// ===== ПОЛУЧЕНИЕ ПРОФИЛЯ =====
app.get("/profile/:telegram_id", async (req, res) => {
    try {
        const telegram_id = String(req.params.telegram_id).replace(".0", "");

        const result = await pool.query(
            "SELECT * FROM users WHERE telegram_id = $1",
            [telegram_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// ===== ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (АДМИН) =====
app.get("/users", async (req, res) => {
    try {
        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// ===== ИЗМЕНЕНИЕ БАЛАНСА (АДМИН) =====
app.post("/admin/balance", async (req, res) => {
    try {
        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        let {
            telegram_id,
            action,
            amount
        } = req.body;

        telegram_id = String(telegram_id).replace(".0", "");
        amount = Number(amount);

        if (!telegram_id || isNaN(amount)) {
            return res.status(400).json({
                error: "Invalid data"
            });
        }

        const result = await pool.query(
            "SELECT balance FROM users WHERE telegram_id = $1",
            [telegram_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        let balance = Number(result.rows[0].balance);

        switch (action) {
            case "add":
                balance += amount;
                break;
            case "subtract":
                balance -= amount;
                break;
            case "set":
                balance = amount;
                break;
            default:
                return res.status(400).json({
                    error: "Unknown action"
                });
        }

        await pool.query(
            "UPDATE users SET balance = $1 WHERE telegram_id = $2",
            [balance, telegram_id]
        );

        res.json({
            success: true,
            balance: balance
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// ===== ПОЛУЧЕНИЕ STARS ПОЛЬЗОВАТЕЛЯ =====
app.get("/stars/:telegram_id", async (req, res) => {
    try {
        const telegram_id = String(req.params.telegram_id).replace(".0", "");
        
        const result = await pool.query(
            "SELECT stars FROM users WHERE telegram_id = $1",
            [telegram_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({
            stars: result.rows[0].stars || 0
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== НАЧИСЛЕНИЕ STARS (АДМИН) =====
app.post("/admin/stars", async (req, res) => {
    try {
        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({ error: "Access denied" });
        }
        
        let { telegram_id, stars, action } = req.body;
        telegram_id = String(telegram_id).replace(".0", "");
        stars = Number(stars);
        
        if (!telegram_id || isNaN(stars)) {
            return res.status(400).json({ error: "Invalid data" });
        }
        
        const userCheck = await pool.query(
            "SELECT stars FROM users WHERE telegram_id = $1",
            [telegram_id]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        let currentStars = Number(userCheck.rows[0].stars);
        let newStars = currentStars + stars;
        
        if (action === 'set') {
            newStars = stars;
        }
        
        await pool.query(
            "UPDATE users SET stars = $1 WHERE telegram_id = $2",
            [newStars, telegram_id]
        );
        
        res.json({
            success: true,
            stars: newStars
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== ПОЛУЧЕНИЕ ИСТОРИИ ТРАНЗАКЦИЙ =====
app.get("/transactions/:telegram_id", async (req, res) => {
    try {
        const telegram_id = String(req.params.telegram_id).replace(".0", "");
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                telegram_id TEXT,
                type TEXT,
                amount DOUBLE PRECISION,
                stars INTEGER,
                description TEXT,
                status TEXT,
                created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
            )
        `);
        
        const result = await pool.query(
            "SELECT * FROM transactions WHERE telegram_id = $1 ORDER BY created_at DESC LIMIT 50",
            [telegram_id]
        );
        
        res.json(result.rows);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== СБРОС БД =====
app.get("/reset", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM users"
        );
        res.json({
            success: true,
            deleted: result.rowCount
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});