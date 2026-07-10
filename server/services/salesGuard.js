const db = require("../config/database");


async function stopSales(reason) {

    await db.query(`
        UPDATE settings
        SET
            sales_enabled = false,
            sales_stop_reason = $1,
            updated_at = NOW()
        WHERE id = 1
    `, [
        reason
    ]);

    console.log("🔴 SALES STOPPED:", reason);
}


async function startSales() {

    await db.query(`
        UPDATE settings
        SET
            sales_enabled = true,
            sales_stop_reason = NULL,
            updated_at = NOW()
        WHERE id = 1
    `);

    console.log("🟢 SALES STARTED");
}


async function canSell() {

    const result = await db.query(`
        SELECT sales_enabled
        FROM settings
        WHERE id = 1
    `);

    return result.rows[0]?.sales_enabled === true;
}


async function getStatus() {

    const result = await db.query(`
        SELECT 
            sales_enabled,
            updated_at
        FROM settings
        WHERE id = 1
    `);

    return result.rows[0];
}


module.exports = {
    stopSales,
    startSales,
    canSell,
    getStatus
};