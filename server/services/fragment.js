async function getStarPriceTon() {

    const response = await fetch(
        "https://fragment-api.ydns.eu:8443/api/v1/prices"
    );

    const data = await response.json();

    return Number(
        data.stars.price_with_commission_kyc
    );

}

module.exports = {
    getStarPriceTon
};