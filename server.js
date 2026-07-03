const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "white-stars-super-admin";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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
            registered_at BIGINT,
            last_seen BIGINT,
            total_spent DOUBLE PRECISION DEFAULT 0,
            total_deposit DOUBLE PRECISION DEFAULT 0,
            referral_count INTEGER DEFAULT 0,
            referrer_id TEXT
        );
    `);
await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        stars50 DOUBLE PRECISION DEFAULT 95,
        stars75 DOUBLE PRECISION DEFAULT 140,
        stars100 DOUBLE PRECISION DEFAULT 185,
        stars150 DOUBLE PRECISION DEFAULT 275,
        stars250 DOUBLE PRECISION DEFAULT 455,
        stars500 DOUBLE PRECISION DEFAULT 910,
        stars1000 DOUBLE PRECISION DEFAULT 1820,

        sales_enabled BOOLEAN DEFAULT TRUE,
        deposits_enabled BOOLEAN DEFAULT TRUE,
        referrals_enabled BOOLEAN DEFAULT TRUE,
        balance_payment_enabled BOOLEAN DEFAULT TRUE
    );
`);

await pool.query(`
INSERT INTO settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
`);
    console.log("PostgreSQL подключена");
})();

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "3.0.0"
    });
});
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
                registered_at,
                last_seen
            )
            VALUES
            ($1,$2,$3,$4,$5,0,$6,$7)
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
            [
                balance,
                telegram_id
            ]
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
app.get("/settings", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM settings WHERE id = 1"
        );

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

app.post("/settings", async (req, res) => {
    try {

        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const data = req.body;

        await pool.query(
            `UPDATE settings SET
                stars50 = $1,
                stars75 = $2,
                stars100 = $3,
                stars150 = $4,
                stars250 = $5,
                stars500 = $6,
                stars1000 = $7,
                sales_enabled = $8,
                deposits_enabled = $9,
                referrals_enabled = $10,
                balance_payment_enabled = $11
             WHERE id = 1`,
            [
                data.stars50,
                data.stars75,
                data.stars100,
                data.stars150,
                data.stars250,
                data.stars500,
                data.stars1000,
                data.sales_enabled,
                data.deposits_enabled,
                data.referrals_enabled,
                data.balance_payment_enabled
            ]
        );

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});