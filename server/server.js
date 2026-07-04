require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");
const walletRoutes = require("./routes/wallet");
const balanceRoutes = require("./routes/balance");
const operationRoutes = require("./routes/operations");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../")));
const initDatabase = require("./database/initDatabase");
app.use("/users", userRoutes);

app.use("/settings", settingsRoutes);

app.use("/wallet", walletRoutes);

app.use("/balance", balanceRoutes);

app.use("/operations", operationRoutes);

// =========================
// CONFIG
// =========================

require("./config/database");

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================
// STATIC
// =========================

app.use(express.static(path.join(__dirname, "../")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/js", express.static(path.join(__dirname, "../js")));

// =========================
// ROUTES
// =========================

app.use("/api/users", require("./routes/users"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/operations", require("./routes/operations"));
app.use("/api/balance", require("./routes/balance"));
app.use("/api/admin", require("./routes/admin"));

// =========================
// HEALTHCHECK
// =========================

app.get("/", (req, res) => {
    res.json({
        status: "online",
        project: "WHITE STARS",
        version: "2.0"
    });
});

// =========================
// 404
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =========================
// ERROR
// =========================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

initDatabase();
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 WHITE STARS started on port ${PORT}`);
});