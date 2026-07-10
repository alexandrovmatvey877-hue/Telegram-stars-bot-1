let salesState = {
    enabled: true,
    status: "GREEN",
    reason: null
};

function stopSales(reason) {
    salesState.enabled = false;
    salesState.status = "RED";
    salesState.reason = reason;

    console.log("🔴 SALES STOPPED:", reason);
}

function startSales() {
    salesState.enabled = true;
    salesState.status = "GREEN";
    salesState.reason = null;

    console.log("🟢 SALES STARTED");
}

function canSell() {
    return salesState.enabled;
}

function getStatus() {
    return salesState;
}

module.exports = {
    stopSales,
    startSales,
    canSell,
    getStatus
};