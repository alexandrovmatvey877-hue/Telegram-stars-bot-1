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
        console.error("Ошибка БД:", err);
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
            balance INTEGER DEFAULT 0
        )
    `);
});

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "2.0.0"
    });
});

app.post("/register", (req, res) => {

    let { telegram_id, username } = req.body;
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
                return res.json({
                    success: true,
                    user: row
                });
            }

            db.run(
                "INSERT INTO users (telegram_id, username, balance) VALUES (?, ?, 0)",
                [telegram_id, username],
                function(err) {

                    if (err) {
                        console.error(err);
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

    db.get(
        "SELECT * FROM users WHERE telegram_id = ?",
        [String(req.params.telegram_id).replace(".0", "")],
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

    console.log("USERS ROUTE");

    db.all(
        "SELECT * FROM users ORDER BY id DESC",
        [],
        (err, rows) => {

            console.log(rows);

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);

        }
    );

});