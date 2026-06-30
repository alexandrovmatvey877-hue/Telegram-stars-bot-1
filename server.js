const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Подключение базы данных
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Ошибка подключения к базе:", err.message);
    } else {
        console.log("SQLite подключена");

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_id TEXT UNIQUE,
                username TEXT,
                first_name TEXT,
                balance REAL DEFAULT 0
            )
        `);
    }
});

// Проверка работы сервера
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "1.0.0"
    });
});

// Проверка API
app.get("/api", (req, res) => {
    res.json({
        message: "WHITE STARS API работает"
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});