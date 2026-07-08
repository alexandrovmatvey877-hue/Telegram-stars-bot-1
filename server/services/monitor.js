const db = require("../config/database");
async function getTonPrice() {

    try {

        const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=rub"
        );

        const data = await response.json();
        return data["the-open-network"].rub;

    } catch (err) {

        console.error("TON PRICE ERROR:", err);

        return null;

    }

}
async function updatePrices() {

    const tonRate = await getTonPrice();

    if (!tonRate) {
        return;
    }

    // Себестоимость одной звезды в TON
    const TON_PER_STAR = 0.013;

    // Наценка 10%
    const MARKUP = 1.10;

    // Ограничения
    const MIN_STAR_PRICE = 1.00;
    const MAX_STAR_PRICE = 1.50;

    const packs = [50, 75, 100, 150, 250, 500, 1000];

    const result = {};

    for (const stars of packs) {

        const costRub = stars * TON_PER_STAR * tonRate;

        let price = costRub * MARKUP;

        const min = stars * MIN_STAR_PRICE;
        const max = stars * MAX_STAR_PRICE;

        price = Math.max(price, min);
        price = Math.min(price, max);

        result["stars" + stars] = Math.ceil(price);
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

    console.log("✅ Цены обновлены:", result);

}

module.exports = {
    getTonPrice,
    updatePrices
};