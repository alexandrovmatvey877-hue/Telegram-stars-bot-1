const { Pool } = require("pg");

// ==============================
// PostgreSQL
// ==============================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Проверка подключения
async function connectDatabase() {

    try {

        const client = await pool.connect();

        console.log("✅ PostgreSQL подключена");

        client.release();

    } catch (error) {

        console.error("❌ Ошибка подключения к PostgreSQL");
        console.error(error);

        process.exit(1);

    }

}

module.exports = {
    pool,
    connectDatabase
};