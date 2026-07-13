const db = require("../config/database");

async function initDatabase() {

    try {

        // ===========================
        // USERS
        // ===========================

        await db.query(`

        CREATE TABLE IF NOT EXISTS users(

            id SERIAL PRIMARY KEY,

            telegram_id TEXT UNIQUE,

            username TEXT,
            first_name TEXT,
            last_name TEXT,

            avatar TEXT,

            balance DOUBLE PRECISION DEFAULT 0,

            registered_at TIMESTAMP DEFAULT NOW(),
            last_seen TIMESTAMP DEFAULT NOW(),

            total_spent DOUBLE PRECISION DEFAULT 0,
            total_deposit DOUBLE PRECISION DEFAULT 0,

            referral_count INTEGER DEFAULT 0,
            referrer_id TEXT,

            wallet_address TEXT,
is_banned BOOLEAN DEFAULT false,

ban_reason TEXT,

warning_count INTEGER DEFAULT 0,

theme TEXT DEFAULT 'dark',

font_size TEXT DEFAULT 'normal',

language TEXT DEFAULT 'ru'

        );

        `);

        // ===========================
        // SETTINGS
        // ===========================

        await db.query(`

        CREATE TABLE IF NOT EXISTS settings(

            id INTEGER PRIMARY KEY,

            stars50 DOUBLE PRECISION DEFAULT 0,
            stars75 DOUBLE PRECISION DEFAULT 0,
            stars100 DOUBLE PRECISION DEFAULT 0,
            stars150 DOUBLE PRECISION DEFAULT 0,
            stars250 DOUBLE PRECISION DEFAULT 0,
            stars500 DOUBLE PRECISION DEFAULT 0,
            stars1000 DOUBLE PRECISION DEFAULT 0,

            ton_wallet TEXT,

            ton_rate DOUBLE PRECISION DEFAULT 0,
            stars_rate DOUBLE PRECISION DEFAULT 0,

            mode TEXT DEFAULT 'auto',

            sales_enabled BOOLEAN DEFAULT true,
            sales_stop_reason TEXT,
            deposits_enabled BOOLEAN DEFAULT true,
            referrals_enabled BOOLEAN DEFAULT true,
            balance_payment_enabled BOOLEAN DEFAULT true,

            updated_at TIMESTAMP DEFAULT NOW()

        );

        `);

await db.query(`
    ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS sales_stop_reason TEXT;
`);
await db.query(`
    ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS system_status TEXT DEFAULT 'GREEN';
`);

        // ===========================
        // OPERATIONS
        // ===========================

        await db.query(`

        CREATE TABLE IF NOT EXISTS operations(

            id SERIAL PRIMARY KEY,

            telegram_id TEXT,

            username TEXT,

            type TEXT,

            amount DOUBLE PRECISION DEFAULT 0,

            status TEXT DEFAULT 'completed',

            comment TEXT,

            created_at TIMESTAMP DEFAULT NOW()

        );

        `);

        // ===========================
        // SETTINGS ROW
        // ===========================

        await db.query(`

        INSERT INTO settings(id)

        VALUES(1)

        ON CONFLICT(id)

        DO NOTHING;

        `);

// ===========================
// SECURITY LOGS
// ===========================

await db.query(`

CREATE TABLE IF NOT EXISTS security_logs(

    id SERIAL PRIMARY KEY,

    action TEXT NOT NULL,

    data JSONB,

    created_at TIMESTAMP DEFAULT NOW()

);

`);

        console.log("✅ Database initialized");

    } catch (err) {

        console.error(err);

    }

}

module.exports = initDatabase;