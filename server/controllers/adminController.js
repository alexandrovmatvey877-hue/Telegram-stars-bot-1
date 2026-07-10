const db = require("../config/database");
const salesGuard = require("../services/salesGuard");
const passwordGuard = require("../services/passwordGuard");

// =========================
// Все пользователи
// =========================

exports.getUsers = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT *
            FROM users
            ORDER BY registered_at DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =========================
// Изменение баланса
// =========================

exports.updateBalance = async (req, res) => {

    try {

        const { telegram_id, action, amount } = req.body;

        const result = await db.query(
            "SELECT balance FROM users WHERE telegram_id=$1",
            [telegram_id]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let balance = Number(result.rows[0].balance);

        switch (action) {

            case "add":
                balance += Number(amount);
                break;

            case "subtract":
                balance -= Number(amount);
                break;

            case "set":
                balance = Number(amount);
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid action"
                });

        }

        await db.query(
            "UPDATE users SET balance=$1 WHERE telegram_id=$2",
            [balance, telegram_id]
        );

        res.json({
            success: true,
            balance
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =========================
// Статистика
// =========================

exports.getStats = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT

                COUNT(*) AS users,

                COALESCE(SUM(balance),0) AS balance,

                COALESCE(SUM(total_deposit),0) AS deposits,

                COALESCE(SUM(total_spent),0) AS spent

            FROM users

        `);

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
exports.changeSalesState = async (req, res) => {

    try {

        const { action, password } = req.body;

        if (action === "stop") {

            if (!passwordGuard.checkStopPassword(password)) {

                return res.status(403).json({
                    success: false,
                    message: "Неверный пароль"
                });

            }

            await salesGuard.stopSales("Manual stop", "manual");

            return res.json({
                success: true,
                status: "STOPPED"
            });

        }

        if (action === "start") {

            if (!passwordGuard.checkStartPassword(password)) {

                return res.status(403).json({
                    success: false,
                    message: "Неверный пароль"
                });

            }

            await salesGuard.startSales();

            return res.json({
                success: true,
                status: "STARTED"
            });

        }

        return res.status(400).json({
            success: false,
            message: "Unknown action"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
exports.getSystemStatus = async (req, res) => {

    try {

        const status = require("../services/monitor")
            .getServiceStatus();

        const sales = require("../services/salesGuard")
            .getSalesInfo();

        res.json({
            success: true,
            system: status,
            sales
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};