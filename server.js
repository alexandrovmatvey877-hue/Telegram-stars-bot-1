const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = "white-stars-super-admin";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

(async () => {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            telegram_id TEXT UNIQUE,
            username TEXT,
            first_name TEXT,
            last_name TEXT,
            avatar TEXT,
            balance DOUBLE PRECISION DEFAULT 0,
            registered_at BIGINT,
            last_seen BIGINT,
            total_spent DOUBLE PRECISION DEFAULT 0,
            total_deposit DOUBLE PRECISION DEFAULT 0,
            referral_count INTEGER DEFAULT 0,
            referrer_id TEXT,
            wallet_address TEXT
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (

            id INTEGER PRIMARY KEY,

            stars50 DOUBLE PRECISION DEFAULT 0,
            stars75 DOUBLE PRECISION DEFAULT 0,
            stars100 DOUBLE PRECISION DEFAULT 0,
            stars150 DOUBLE PRECISION DEFAULT 0,
            stars250 DOUBLE PRECISION DEFAULT 0,
            stars500 DOUBLE PRECISION DEFAULT 0,
            stars1000 DOUBLE PRECISION DEFAULT 0,

            ton_wallet TEXT DEFAULT '',
            ton_rate DOUBLE PRECISION DEFAULT 0,
            stars_rate DOUBLE PRECISION DEFAULT 0,

            mode TEXT DEFAULT 'auto',

            sales_enabled BOOLEAN DEFAULT TRUE,
            deposits_enabled BOOLEAN DEFAULT TRUE,
            referrals_enabled BOOLEAN DEFAULT TRUE,
            balance_payment_enabled BOOLEAN DEFAULT TRUE,

            updated_at BIGINT DEFAULT 0

        );
    `);

    await pool.query(`
        INSERT INTO settings (id)
        VALUES (1)
        ON CONFLICT (id) DO NOTHING;
    `);

    console.log("✅ PostgreSQL подключена");

})();

app.get("/", (req, res) => {

    res.json({
        status: "ok",
        project: "WHITE STARS",
        version: "4.0.0"
    });

});

app.post("/register", async (req, res) => {

    try {

        let {
            telegram_id,
            username,
            first_name,
            last_name,
            avatar
        } = req.body;

        telegram_id = String(telegram_id).replace(".0", "");

        const exists = await pool.query(
            "SELECT id FROM users WHERE telegram_id=$1",
            [telegram_id]
        );

        if (exists.rows.length) {

            const user = await pool.query(

                `UPDATE users

                SET

                username=$1,
                first_name=$2,
                last_name=$3,
                avatar=$4,
                last_seen=$5

                WHERE telegram_id=$6

                RETURNING *`,

                [
                    username,
                    first_name,
                    last_name,
                    avatar,
                    Date.now(),
                    telegram_id
                ]

            );

            return res.json(user.rows[0]);

        }

        const created = await pool.query(

            `INSERT INTO users(

                telegram_id,
                username,
                first_name,
                last_name,
                avatar,
                registered_at,
                last_seen

            )

            VALUES($1,$2,$3,$4,$5,$6,$7)

            RETURNING *`,

            [

                telegram_id,
                username,
                first_name,
                last_name,
                avatar,
                Date.now(),
                Date.now()

            ]

        );

        res.json(created.rows[0]);

    } catch (e) {

        console.error(e);

        res.status(500).json({
            error: e.message
        });

    }

});

app.get("/profile/:telegram_id", async (req, res) => {

    try {

        const result = await pool.query(

            "SELECT * FROM users WHERE telegram_id=$1",

            [String(req.params.telegram_id)]

        );

        if (!result.rows.length)
            return res.status(404).json({
                error: "User not found"
            });

        res.json(result.rows[0]);

    } catch (e) {

        res.status(500).json({
            error: e.message
        });

    }

});

// ====================== НАСТРОЙКИ ======================

app.get("/settings", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM settings WHERE id = 1"
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/settings", async (req, res) => {

    try {

        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const {
            ton_wallet,
            ton_rate,
            stars_rate,
            mode
        } = req.body;

        await pool.query(
            `UPDATE settings
             SET
                ton_wallet = $1,
                ton_rate = $2,
                stars_rate = $3,
                mode = $4,
                updated_at = $5
             WHERE id = 1`,
            [
                ton_wallet,
                ton_rate,
                stars_rate,
                mode,
                Date.now()
            ]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ====================== WALLET ======================

app.post("/wallet", async (req, res) => {

    try {

        const { telegram_id, wallet_address } = req.body;

        await pool.query(
            `UPDATE users
             SET wallet_address = $1
             WHERE telegram_id = $2`,
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
            error: err.message
        });

    }

});

app.get("/wallet/:telegram_id", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT wallet_address
             FROM users
             WHERE telegram_id = $1`,
            [req.params.telegram_id]
        );

        res.json({
            wallet: result.rows[0]?.wallet_address || null
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            wallet: null
        });

    }

});
// ====================== НАСТРОЙКИ ======================

app.get("/settings", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM settings WHERE id = 1"
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/settings", async (req, res) => {

    try {

        if (req.headers["x-admin-key"] !== ADMIN_KEY) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const {
            ton_wallet,
            ton_rate,
            stars_rate,
            mode
        } = req.body;

        await pool.query(
            `UPDATE settings
             SET
                ton_wallet = $1,
                ton_rate = $2,
                stars_rate = $3,
                mode = $4,
                updated_at = $5
             WHERE id = 1`,
            [
                ton_wallet,
                ton_rate,
                stars_rate,
                mode,
                Date.now()
            ]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});


// ====================== ЗАПУСК ======================

app.listen(PORT, () => {

    console.log(`Server started on port ${PORT}`);

});