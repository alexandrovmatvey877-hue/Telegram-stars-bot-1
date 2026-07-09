const prices = require("./prices");
const db = require("../config/database");
async function getTonPrice() {

    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub"
        );

        const data = await response.json();

if (!data["the-open-network"] || data["the-open-network"].rub == null) {
    console.error("TON PRICE ERROR: неверный ответ API", data);
    return null;
}

return data["the-open-network"].rub;

    } catch (err) {

        console.error("TON PRICE ERROR:", err);

        return null;

    }

}
async function getStarPriceTon() {

    try {

        const response = await fetch(
            "https://fragment-api.ydns.eu:8443/api/v1/prices"
        );

        const data = await response.json();

        return Number(
            data.stars.price_with_commission_kyc
        );

    } catch (err) {

        console.error("STAR PRICE ERROR:", err);

        return null;

    }

}
async function updatePrices() {

    const result = await prices.calculatePrices();

    if (!result) {
        console.log("❌ Не удалось получить цены");
        return;
    }

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

}

module.exports = {
    getTonPrice,
    getStarPriceTon,
    updatePrices
};