function checkStopPassword(password) {
    return password === process.env.SALES_STOP_PASSWORD;
}

function checkStartPassword(password) {
    return password === process.env.SALES_START_PASSWORD;
}

module.exports = {
    checkStopPassword,
    checkStartPassword
};