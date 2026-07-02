const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "white-stars-super-admin";

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Ошибка SQLite:", err);
    } else {
        console.log("SQLite подключена");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id TEXT UNIQUE,

            username TEXT,

            first_name TEXT,
            last_name TEXT,

            avatar TEXT,

            balance REAL DEFAULT 0,

            registered_at INTEGER,
            last_seen INTEGER,

            total_spent REAL DEFAULT 0,
            total_deposit REAL DEFAULT 0,

            referral_count INTEGER DEFAULT 0,
            referrer_id TEXT

        )
    `);

});

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "3.0.0"
    });
});
app.post("/register", (req, res) => {
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

    db.get(
        "SELECT * FROM users WHERE telegram_id = ?",
        [telegram_id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (row) {

    db.run(
        `UPDATE users
         SET username = ?,
             first_name = ?,
             last_name = ?,
             avatar = ?,
             last_seen = ?
         WHERE telegram_id = ?`,
        [
            username,
            first_name,
            last_name,
            avatar,
            Date.now(),
            telegram_id
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            db.get(
                "SELECT * FROM users WHERE telegram_id = ?",
                [telegram_id],
                (err, user) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        success: true,
                        user
                    });

                }
            );

        }
    );

    return;
}

            db.run(
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
(?, ?, ?, ?, ?, 0, ?, ?)`
                [
telegram_id,
username,
first_name,
last_name,
avatar,
Date.now(),
Date.now()
],
                function(err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    db.get(
                        "SELECT * FROM users WHERE telegram_id = ?",
                        [telegram_id],
                        (err, user) => {

                            if (err) {
                                return res.status(500).json({
                                    error: err.message
                                });
                            }

                            res.json({
                                success: true,
                                user
                            });

                        }
                    );

                }
            );

        }
    );

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

 (req, res) => {

    if (req.headers["x-admin-key"] !== ADMIN_KEY) {
        return res.status(403).json({
            error: "Access denied"
        });
    }

    let { telegram_id, balance } = req.body;

    telegram_id = String(telegram_id).replace(".0", "");

    if (!telegram_id) {
        return res.status(400).json({
            error: "telegram_id is required"
        });
    }

    balance = Number(balance);

    if (isNaN(balance)) {
        return res.status(400).json({
            error: "Invalid balance"
        });
    }

    db.run(
        "UPDATE users SET balance = ? WHERE telegram_id = ?",
        [balance, telegram_id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                updated: this.changes
            });

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