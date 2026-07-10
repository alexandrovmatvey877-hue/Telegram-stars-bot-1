const db = require("../config/database");
const salesGuard = require("./salesGuard");
// ======================
// SAFETY
// ======================

let warningCounter = 0;
let emergencyMode = false;
let tonCache = {
    price: null,
    updatedAt: 0
};

const TON_CACHE_TIME = 10 * 60 * 1000;
async function getTonPrice() {

    const now = Date.now();

    if (
        tonCache.price &&
        now - tonCache.updatedAt < TON_CACHE_TIME
    ) {

        console.log("🟢 TON price from cache");

        return tonCache.price;
    }


    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub"
        );


        const data = await response.json();


        if (
            !data["the-open-network"] ||
            data["the-open-network"].rub == null
        ) {

            console.error(
                "TON PRICE ERROR: неверный ответ API",
                data
            );

            await salesGuard.stopSales(
                "CoinGecko invalid response"
            );

            return null;
        }


        const price = data["the-open-network"].rub;


        tonCache.price = price;
        tonCache.updatedAt = now;


        console.log(
            "💎 TON price updated:",
            price
        );


        return price;


    } catch (err) {

        console.error(
            "TON PRICE ERROR:",
            err
        );


        await salesGuard.stopSales(
            "CoinGecko connection failed"
        );


        return null;

    }

}
async function getStarPriceTon() {

    try {

        const response = await fetch(
            "https://fragment-api.ydns.eu:8443/api/v1/prices"
        );

        if (!response.ok) {

            console.error(
                "FRAGMENT ERROR:",
                response.status
            );

            await salesGuard.stopSales(
                "Fragment API unavailable"
            );

            return null;
        }


        const data = await response.json();


        if (
            !data.stars ||
            !data.stars.price_with_commission_kyc
        ) {

            console.error(
                "FRAGMENT INVALID DATA",
                data
            );

            await salesGuard.stopSales(
                "Fragment invalid response"
            );

            return null;
        }


        return Number(
            data.stars.price_with_commission_kyc
        );


    } catch (err) {

        console.error(
            "STAR PRICE ERROR:",
            err
        );


        await salesGuard.stopSales(
            "Fragment connection failed"
        );


        return null;

    }

}
function checkSafety(result) {

    const values = Object.values(result);

    const MAX_PRICE_PER_STAR = 2;
    const MIN_PRICE_PER_STAR = 1;

    const maxReached = values.some((price, index) => {
        const stars = [50, 75, 100, 150, 250, 500, 1000][index];
        return price >= stars * MAX_PRICE_PER_STAR;
    });

    const minReached = values.some((price, index) => {
        const stars = [50, 75, 100, 150, 250, 500, 1000][index];
        return price <= stars * MIN_PRICE_PER_STAR;
    });

    if (maxReached) {

        warningCounter++;

        console.warn(`⚠ WARNING: достигнут потолок (${warningCounter})`);

    } else if (minReached) {

        warningCounter++;

        console.warn(`⚠ WARNING: достигнут пол (${warningCounter})`);

    } else {

        warningCounter = 0;

    }
if (warningCounter >= 5) {

    emergencyStop();

}

}
async function emergencyStop() {

    console.error("🚨 EMERGENCY MODE");

    emergencyMode = true;

    await salesGuard.stopSales(
        "Automatic safety stop"
    );

    console.error("⛔ Продажи автоматически отключены");

}
async function emergencyRecover() {

    if (!emergencyMode) {
        return;
    }

    if (warningCounter !== 0) {
        return;
    }

    emergencyMode = false;

    console.log("🟢 EMERGENCY RECOVER");

    await salesGuard.startSales();

    console.log("✅ Продажи автоматически включены");

}
async function updatePrices() {

    const prices = require("./prices");
    const result = await prices.calculatePrices();

if (!result) {

    warningCounter++;

    console.warn(
        `⚠ WARNING: не удалось рассчитать цены (${warningCounter})`
    );

    return;

}

checkSafety(result);

    await db.query(`
        UPDATE settings
        SET
            stars50=$1,
            stars75=$2,
            stars100=$3,
            stars150=$4,
            stars250=$5,
            stars500=$6,
            stars1000=$7,
            updated_at=NOW()
        WHERE id=1
    `, [
        result.stars50,
        result.stars75,
        result.stars100,
        result.stars150,
        result.stars250,
        result.stars500,
        result.stars1000
    ]);

    console.log("✅ Цены обновлены:");
    console.log(result);
console.log("Safety counter =", warningCounter);
await emergencyRecover();

}

module.exports = {
    getTonPrice,
    getStarPriceTon,
    updatePrices
};