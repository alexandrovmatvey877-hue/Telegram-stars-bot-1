const monitor = require("./monitor");

// пакеты Stars
const PACKS = [50, 75, 100, 150, 250, 500, 1000];

// настройки
const MARKUP = 1.10;

// ограничения
const MIN_PRICE_PER_STAR = 1.00;
const MAX_PRICE_PER_STAR = 1.50;

async function calculatePrices() {

    const tonRub = await monitor.getTonPrice();
    const starTon = await monitor.getStarPriceTon();

    if (!tonRub || !starTon) {
        return null;
    }

    const result = {};

    for (const stars of PACKS) {

        let price = stars * starTon * tonRub;

        price *= MARKUP;

        const min = stars * MIN_PRICE_PER_STAR;
        const max = stars * MAX_PRICE_PER_STAR;

        price = Math.max(price, min);
        price = Math.min(price, max);

        result["stars" + stars] = Math.ceil(price);

    }

    return result;

}

module.exports = {
    calculatePrices
};