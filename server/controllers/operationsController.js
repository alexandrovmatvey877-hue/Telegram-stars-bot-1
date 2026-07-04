const db = require("../config/database");

// =====================================
// Все операции
// =====================================

exports.getAllOperations = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT *
            FROM operations
            ORDER BY created_at DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =====================================
// Операции пользователя
// =====================================

exports.getUserOperations = async (req, res) => {

    try {

        const { telegram_id } = req.params;

        const result = await db.query(`
            SELECT *
            FROM operations
            WHERE telegram_id=$1
            ORDER BY created_at DESC
        `, [telegram_id]);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =====================================
// Получить одну операцию
// =====================================

exports.getOperation = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT *
            FROM operations
            WHERE id=$1
        `, [req.params.id]);

        if (!result.rows.length) {

            return res.status(404).json({
                success: false
            });

        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =====================================
// Создать операцию
// =====================================

exports.createOperation = async (req, res) => {

    try {

        const {

            telegram_id,
            username,
            type,
            amount,
            status,
            comment

        } = req.body;

        const result = await db.query(`

            INSERT INTO operations(

                telegram_id,
                username,
                type,
                amount,
                status,
                comment,
                created_at

            )

            VALUES($1,$2,$3,$4,$5,$6,NOW())

            RETURNING *

        `, [

            telegram_id,
            username,
            type,
            amount,
            status,
            comment

        ]);

        res.json({
            success: true,
            operation: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};