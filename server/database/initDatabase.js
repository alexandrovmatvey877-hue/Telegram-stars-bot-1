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
    referrer_id BIGINT DEFAULT NULL,

    wallet_address TEXT,

    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,

    warning_count INTEGER DEFAULT 0,

    theme TEXT DEFAULT 'dark',
    font_size TEXT DEFAULT 'normal',
    language TEXT DEFAULT 'ru',

    wheel_spins INTEGER DEFAULT 1,
    last_spin TIMESTAMP,
    next_spin TIMESTAMP

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
ALTER TABLE users
ADD COLUMN IF NOT EXISTS wheel_spins INTEGER DEFAULT 3;
`);

await db.query(`
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_spin TIMESTAMP;
`);

await db.query(`
ALTER TABLE users
ADD COLUMN IF NOT EXISTS next_spin TIMESTAMP;
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
// ===========================
// ORDERS
// ===========================

await db.query(`

CREATE TABLE IF NOT EXISTS orders(

    id SERIAL PRIMARY KEY,

    order_id TEXT UNIQUE NOT NULL,

    telegram_id TEXT NOT NULL,

    type TEXT NOT NULL,

    product TEXT NOT NULL,

    amount DOUBLE PRECISION DEFAULT 0,

    currency TEXT DEFAULT 'RUB',

    status TEXT DEFAULT 'pending',

    payment_id TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    paid_at TIMESTAMP

);

`);
// ===========================
// WHEEL SETTINGS
// ===========================

await db.query(`

CREATE TABLE IF NOT EXISTS wheel_settings(

    id SERIAL PRIMARY KEY,

    enabled BOOLEAN DEFAULT true,

    cost DOUBLE PRECISION DEFAULT 0,

    cooldown INTEGER DEFAULT 86400,

    updated_at TIMESTAMP DEFAULT NOW()

);

`);


// ===========================
// WHEEL PRIZES
// ===========================

await db.query(`

CREATE TABLE IF NOT EXISTS wheel_prizes(

    id SERIAL PRIMARY KEY,

    name TEXT NOT NULL,

    type TEXT NOT NULL,

    value DOUBLE PRECISION DEFAULT 0,

    chance DOUBLE PRECISION DEFAULT 0,

    enabled BOOLEAN DEFAULT true

);

`);


// ===========================
// WHEEL HISTORY
// ===========================

await db.query(`

CREATE TABLE IF NOT EXISTS wheel_history(

    id SERIAL PRIMARY KEY,

    telegram_id TEXT NOT NULL,

    prize_id INTEGER,

    prize_name TEXT,

    created_at TIMESTAMP DEFAULT NOW()

);

`);


// DEFAULT SETTINGS

await db.query(`

INSERT INTO wheel_settings(id)

VALUES(1)

ON CONFLICT(id)

DO NOTHING;

`);


// DEFAULT PRIZES

await db.query(`

INSERT INTO wheel_prizes
(name,type,value,chance,color)

SELECT * FROM (

VALUES

('5 Stars','stars',5,35,'#ff5555'),

('10 Stars','stars',10,25,'#ff9900'),

('50 Stars','stars',50,10,'#ffe066'),

('100 Stars','stars',100,3,'#55ff55'),

('Бонус','balance',20,20,'#55aaff'),

('Пусто','none',0,7,'#777777')

) AS prizes(
name,
type,
value,
chance
)

WHERE NOT EXISTS(
SELECT 1 FROM wheel_prizes
);

`);

await db.query(`
ALTER TABLE wheel_prizes
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#ffffff';
`);


await db.query(`
ALTER TABLE wheel_history
ADD COLUMN IF NOT EXISTS prize_value DOUBLE PRECISION DEFAULT 0;
`);


await db.query(`
CREATE TABLE IF NOT EXISTS promocodes (

    id SERIAL PRIMARY KEY,

    code TEXT UNIQUE NOT NULL,

    type TEXT NOT NULL,

    value NUMERIC NOT NULL,

    max_uses INTEGER DEFAULT 0,

    used_count INTEGER DEFAULT 0,

    expires_at TIMESTAMP,

    color TEXT DEFAULT '#ffffff',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()

);
`);

await db.query(`
CREATE TABLE IF NOT EXISTS promo_uses (

    id SERIAL PRIMARY KEY,

    promo_id INTEGER REFERENCES promocodes(id) ON DELETE CASCADE,

    telegram_id BIGINT NOT NULL,

    used_at TIMESTAMP DEFAULT NOW(),

    reward NUMERIC DEFAULT 0,

    UNIQUE(promo_id, telegram_id)

);
`);

        console.log("✅ Database initialized");

    } catch (err) {

        console.error(err);

    }

}

module.exports = initDatabase;