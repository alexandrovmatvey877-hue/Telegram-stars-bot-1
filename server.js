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

app.get("/profile/:telegram_id", (req, res) => {

    const telegram_id = String(req.params.telegram_id).replace(".0", "");

    db.get(
        "SELECT * FROM users WHERE telegram_id = ?",
        [telegram_id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            res.json(row);

        }
    );

});

app.get("/users", (req, res) => {

    if (req.headers["x-admin-key"] !== ADMIN_KEY) {
        return res.status(403).json({
            error: "Access denied"
        });
    }

    db.all(
        "SELECT * FROM users ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);

        }
    );

});

app.post("/admin/balance", (req, res) => {

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

    db.get(
        "SELECT * FROM users WHERE telegram_id = ?",
        [telegram_id],
        (err, user) => {

            if (err)
                return res.status(500).json({
                    error: err.message
                });

            if (!user)
                return res.status(404).json({
                    error: "User not found"
                });

            let balance = Number(user.balance);

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

            db.run(
                "UPDATE users SET balance = ? WHERE telegram_id = ?",
                [balance, telegram_id],
                function(err) {

                    if (err)
                        return res.status(500).json({
                            error: err.message
                        });

                    res.json({
                        success: true,
                        balance
                    });

                }
            );

        }

    );

});

app.get("/reset", (req, res) => {

    db.run(
        "DELETE FROM users",
        [],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                deleted: this.changes
            });

        }
    );

});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});