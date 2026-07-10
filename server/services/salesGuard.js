const db = require("../config/database");
let salesInfo = {
    source: "system",
    reason: null,
    stoppedAt: null
};

async function stopSales(reason) {

salesInfo.source = "automatic";
salesInfo.reason = reason;
salesInfo.stoppedAt = new Date();

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

 salesInfo.source = "system";
salesInfo.reason = null;
salesInfo.stoppedAt = null;
  
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

function getSalesInfo() {
    return salesInfo;
}

module.exports = {
    stopSales,
    startSales,
    canSell,
    getStatus
    getSalesInfo
};