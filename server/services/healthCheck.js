const db = require("../config/database");
const monitor = require("./monitor");
const salesGuard = require("./salesGuard");


async function checkDatabase() {

    try {

        await db.query("SELECT NOW()");

        return "OK";

    } catch (err) {

        return "ERROR";

    }

}


async function checkFragment() {

    try {

        const price = await monitor.getStarPriceTon();

        if (!price) {
            return "ERROR";
        }

        return "OK";

    } catch (err) {

        return "ERROR";

    }

}


async function checkCoinGecko() {

    try {

        const price = await monitor.getTonPrice();

        if (!price) {
            return "ERROR";
        }

        return "OK";

    } catch (err) {

        return "ERROR";

    }

}


async function getHealth() {

    const database = await checkDatabase();

    const fragment = await checkFragment();

    const coingecko = await checkCoinGecko();

    const sales = await salesGuard.canSell();


    let status = "GREEN";


    if (
        database === "ERROR" ||
        fragment === "ERROR" ||
        coingecko === "ERROR" ||
        !sales
    ) {

        status = "RED";

    }


    return {

        status,

        database,

        fragment,

        coingecko,

        sales

    };

}


module.exports = {
    getHealth
};