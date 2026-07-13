console.log("SERVER STARTING", process.pid);
require("dotenv").config();

const monitor = require("./services/monitor");

const express = require("express");
const cors = require("cors");
const path = require("path");

const initDatabase = require("./database/initDatabase");
const errorHandler = require("./middleware/errorHandler");
const securityHeaders = require("./middleware/security/securityHeaders");

const app = express();

// =========================
// SECURITY
// =========================

// Не показывать, что сервер работает на Express
app.disable("x-powered-by");

// =========================
// DATABASE
// =========================

const db = require("./config/database");

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(securityHeaders);

app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: true
}));

// Логи запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// =========================
// STATIC
// =========================

const ROOT = path.join(__dirname, "..");

app.use(express.static(ROOT));

app.use("/pages", express.static(path.join(ROOT, "pages")));
app.use("/js", express.static(path.join(ROOT, "js")));
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/images", express.static(path.join(ROOT, "images")));

// =========================
// API
// =========================

app.use("/api/users", require("./routes/users"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/premium", require("./routes/premium"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/balance", require("./routes/balance"));
app.use("/api/operations", require("./routes/operations"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/health", require("./routes/health"));

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "WHITE STARS",
        version: "5.0"
    });
});

// =========================
// 404
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

// =========================
// ERROR HANDLER
// =========================

app.use(errorHandler);

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 WHITE STARS started on port ${PORT}`);
});

(async () => {
    try {

        await db.query("SELECT NOW()");

        monitor.setDatabaseStatus("OK");

        await initDatabase();

const price = await monitor.getTonPrice();

console.log("TON PRICE =", price);

await monitor.updatePrices();

// Обновление каждые 5 минут
setInterval(() => {
    monitor.updatePrices();
}, 5 * 60 * 1000);

    } catch (err) {

        console.error("Database init error:");
        console.error(err);

        process.exit(1);

    }
})();