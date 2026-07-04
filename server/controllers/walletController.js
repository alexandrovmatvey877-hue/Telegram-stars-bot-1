const db = require("../config/database");

// ==============================
// Получить кошелек
// ==============================

exports.getWallet = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        const result = await db.query(

            `
            SELECT wallet_address
            FROM users
            WHERE telegram_id = $1
            `,

            [telegram_id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Пользователь не найден"
            });

        }

        res.json({
            success: true,
            wallet: result.rows[0].wallet_address
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });

    }

};

// ==============================
// Сохранить кошелек
// ==============================

exports.saveWallet = async (req, res) => {

    try {

        const {

            telegram_id,
            wallet_address

        } = req.body;

        await db.query(

            `
            UPDATE users
            SET wallet_address = $1
            WHERE telegram_id = $2
            `,

            [

                wallet_address,
                telegram_id

            ]

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });

    }

};

// ==============================
// Удалить кошелек
// ==============================

exports.deleteWallet = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        await db.query(

            `
            UPDATE users
            SET wallet_address = NULL
            WHERE telegram_id = $1
            `,

            [telegram_id]

        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Ошибка сервера"
        });

    }

};