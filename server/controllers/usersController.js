const db = require("../config/database");

// =======================
// Регистрация пользователя
// =======================

exports.register = async (req, res) => {
    try {
        const {
            telegram_id,
            username,
            first_name,
            last_name,
            avatar
        } = req.body;

        if (!telegram_id) {
            return res.status(400).json({
                success: false,
                message: "telegram_id is required"
            });
        }

        const user = await db.query(
            "SELECT * FROM users WHERE telegram_id = $1",
            [telegram_id]
        );

        if (user.rows.length === 0) {

            await db.query(`
                INSERT INTO users(
                    telegram_id,
                    username,
                    first_name,
                    last_name,
                    avatar,
                    registered_at,
last_seen
)
VALUES(
...
EXTRACT(EPOCH FROM NOW()) * 1000,
EXTRACT(EPOCH FROM NOW()) * 1000
)
            `, [
                telegram_id,
                username,
                first_name,
                last_name,
                avatar
            ]);

        } else {

            await db.query(`
                UPDATE users
                SET
                    username=$2,
                    first_name=$3,
                    last_name=$4,
                    avatar=$5,
                    last_seen = EXTRACT(EPOCH FROM NOW()) * 1000
                WHERE telegram_id=$1
            `, [
                telegram_id,
                username,
                first_name,
                last_name,
                avatar
            ]);

        }

        return res.json({
            success: true
        });

    } catch (err) {

    console.error("REGISTER ERROR:");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message
    });

}
};

// =======================
// Получение профиля
// =======================

exports.getProfile = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        const result = await db.query(
            "SELECT * FROM users WHERE telegram_id=$1",
            [telegram_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =======================
// Обновление профиля
// =======================

exports.updateProfile = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        const {
            username,
            first_name,
            last_name,
            avatar
        } = req.body;

        await db.query(`
            UPDATE users
            SET
                username=$2,
                first_name=$3,
                last_name=$4,
                avatar=$5
            WHERE telegram_id=$1
        `, [
            telegram_id,
            username,
            first_name,
            last_name,
            avatar
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

// =======================
// Статистика
// =======================

exports.getStats = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        const result = await db.query(`
            SELECT
                balance,
                total_spent,
                total_deposit,
                referral_count
            FROM users
            WHERE telegram_id=$1
        `, [telegram_id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false
            });

        }

        res.json({
            success: true,
            stats: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
// =======================
// Все пользователи
// =======================

exports.getAllUsers = async (req, res) => {

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
            success: false,
            message: "Failed to load users"
        });

    }

};