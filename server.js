const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Подключение базы
const db = new sqlite3.Database("./database.db");

// Создание таблицы пользователей
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
        version: "1.1.0"
    });
});

// Регистрация пользователя
app.post("/register", (req, res) => {

    const { telegram_id, username } = req.body;
console.log("REGISTER:", telegram_id, username);
    if (!telegram_id) {
        return res.status(400).json({
            error: "telegram_id is required"
        });
    }

    db.run(
        "INSERT OR IGNORE INTO users (telegram_id, username) VALUES (?, ?)",
        [telegram_id, username],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true
            });

        }
    );

});
// Получение профиля
app.get("/profile/:telegram_id", (req, res) => {

    db.get(
        "SELECT * FROM users WHERE telegram_id = ?",
        [req.params.telegram_id],
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
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});