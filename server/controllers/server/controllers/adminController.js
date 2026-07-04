const { pool } = require("../config/database");

// Получить всех пользователей
exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM users
            ORDER BY registered_at DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// Изменить баланс
exports.updateBalance = async (req, res) => {
    try {
        const { telegram_id, balance } = req.body;

        await pool.query(
            `
            UPDATE users
            SET balance = $1
            WHERE telegram_id = $2
            `,
            [balance, telegram_id]
        );

        res.json({
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// Статистика
exports.getStats = async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const deposits = await pool.query(
            "SELECT COALESCE(SUM(total_deposit),0) FROM users"
        );

        const spent = await pool.query(
            "SELECT COALESCE(SUM(total_spent),0) FROM users"
        );

        res.json({
            users: Number(users.rows[0].count),
            deposits: Number(deposits.rows[0].coalesce),
            spent: Number(spent.rows[0].coalesce)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};