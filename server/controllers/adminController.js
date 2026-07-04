const db = require("../config/database");

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

        const {
            telegram_id,
            balance
        } = req.body;

        await db.query(`
            UPDATE users
            SET balance=$1
            WHERE telegram_id=$2
        `, [
            balance,
            telegram_id
        ]);

        res.json({
            success: true
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