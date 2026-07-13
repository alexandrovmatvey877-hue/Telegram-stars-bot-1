const API_URL = "https://white-stars-api.onrender.com";
const ADMIN_KEY = "WS_ADMIN_9f82jd72hd82hd82";

async function api(path, method = "GET", body = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API_URL + path, options);

    if (!response.ok) {

        let error = "Server error";

        try {
            const data = await response.json();
            error = data.error || error;
        } catch {}

        throw new Error(error);
    }

    return await response.json();
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
window.API = {
    getUsers,
    getSettings,
    saveSettings,
    getOperations,
    getSystem,
    saveSystem,
    getHealth,
    changeSales
};