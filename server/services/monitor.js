// наверное до этого я никогда не найду
const fetch = require("node-fetch");

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

module.exports = {
    getTonPrice
};
//нихуя себе... дошел...