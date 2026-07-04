const db = require("../config/database");

// =====================================
// Получить баланс
// =====================================

exports.getBalance = async (req, res) => {

    try {

        const result = await db.query(

            `
            SELECT
                balance,
                total_spent,
                total_deposit
            FROM users
            WHERE telegram_id=$1
            `,

            [req.params.telegram_id]

        );

        if (!result.rows.length) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            ...result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =====================================
// Пополнение
// =====================================

exports.deposit = async (req, res) => {

    try {

        const {

            telegram_id,
            amount

        } = req.body;

        await db.query(`

            UPDATE users

            SET

            balance = balance + $1,
            total_deposit = total_deposit + $1

            WHERE telegram_id=$2

        `, [

            amount,
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

// =====================================
// Списание
// =====================================

exports.withdraw = async (req, res) => {

    try {

        const {

            telegram_id,
            amount

        } = req.body;

        await db.query(`

            UPDATE users

            SET

            balance = balance - $1,
            total_spent = total_spent + $1

            WHERE telegram_id=$2

        `, [

            amount,
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

// =====================================
// Установить баланс
// =====================================

exports.setBalance = async (req, res) => {

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