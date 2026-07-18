const API_URL = "https://white-stars-api.onrender.com";
const ADMIN_KEY = "WS_ADMIN_9f82jd72hd82hd82";

async function api(path, method = "GET", body = null) {

    console.log("API:", API_URL + path);

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API_URL + path, options);

    console.log("STATUS:", response.status);

    const text = await response.text();

    console.log("BODY:", text);

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(text);
    }
}

async function getUsers() {
    return await api("/api/admin/users");
}

async function getSettings() {
    return await api("/api/settings");
}

async function saveSettings(settings) {
    return await api("/api/settings", "POST", settings);
}

async function getOperations() {
    return await api("/api/operations");
}
async function getSystem() {
    return await api("/api/settings/system");
}

async function saveSystem(system) {
    return await api("/api/settings/system", "POST", system);
}
async function getHealth() {
    return await api("/api/health");
}
async function changeSales(action, password) {
    return await api(
        "/api/admin/sales",
        "POST",
        {
            action,
            password
        }
    );
}
async function getPromos() {
    return await api("/api/promocodes");
}

async function createPromo(data) {
    return await api(
        "/api/promocodes/create",
        "POST",
        data
    );
}

async function disablePromo(id) {
    return await api(
        `/api/promocodes/${id}`,
        "PATCH",
        {
            is_active: false
        }
    );
}
async function getWheelPrizes() {
    return await api("/api/wheel/admin/prizes");
}
window.API = {
    getUsers,
    getSettings,
    saveSettings,
    getOperations,
    getSystem,
    saveSystem,
    getHealth,
    changeSales,

    getPromos,
    createPromo,
    disablePromo,
    getWheelPrizes,
};