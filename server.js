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

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});