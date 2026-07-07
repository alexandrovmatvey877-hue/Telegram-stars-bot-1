let settings = {};
let currentSettingsTab = "prices";
const connector = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: window.location.origin + "/tonconnect-manifest.json"
});

async function loadSettings() {

    try {

        const data = await API.getSettings();

settings = data;
        renderSettings(currentSettingsTab);

    } catch (e) {

        console.error(e);

    }

}
function switchSettings(tab) {

    document
        .querySelectorAll(".settings-tab")
        .forEach(btn => btn.classList.remove("active"));

    document
        .querySelector(`[data-settings="${tab}"]`)
        ?.classList.add("active");
    currentSettingsTab = tab;
    renderSettings(tab);

}

function renderSettings(tab) {
console.log("renderSettings settings =", settings);

    const box = document.getElementById("settingsContent");
console.log("settings =", settings);
console.log("typeof =", typeof settings);
console.log("stars50 =", settings.stars50);
    if (!box) return;

    // ===========================
    // ТАРИФЫ
    // ===========================

    if (tab === "prices") {

        box.innerHTML = `

<div class="setting-item">
<label>50 ⭐</label>
<input id="stars50" type="number" value="${settings.stars50 || 0}">
</div>

<div class="setting-item">
<label>75 ⭐</label>
<input id="stars75" type="number" value="${settings.stars75 || 0}">
</div>

<div class="setting-item">
<label>100 ⭐</label>
<input id="stars100" type="number" value="${settings.stars100 || 0}">
</div>

<div class="setting-item">
<label>150 ⭐</label>
<input id="stars150" type="number" value="${settings.stars150 || 0}">
</div>

<div class="setting-item">
<label>250 ⭐</label>
<input id="stars250" type="number" value="${settings.stars250 || 0}">
</div>

<div class="setting-item">
<label>500 ⭐</label>
<input id="stars500" type="number" value="${settings.stars500 || 0}">
</div>

<div class="setting-item">
<label>1000 ⭐</label>
<input id="stars1000" type="number" value="${settings.stars1000 || 0}">
</div>

<button class="save-button" onclick="savePrices()">
💾 Сохранить
</button>

`;

        return;

    }

    // ===========================
    // TON КОШЕЛЕК
    // ===========================

    if (tab === "wallet") {

    box.innerHTML = `

<div class="operation-card">

<h3>💎 TON Wallet</h3>

<p><b>Статус:</b> ${
    settings.ton_wallet ? "Подключен ✅" : "Не подключен"
}</p>

<p><b>Адрес:</b></p>

<div style="
padding:12px;
background:#f5f5f5;
border-radius:10px;
word-break:break-all;
margin-bottom:15px;
">
${settings.ton_wallet || "Не подключен"}
</div>

<button id="connectWalletBtn" class="save-button">
${settings.ton_wallet ? "Переподключить" : "Подключить TON Wallet"}
</button>

</div>

`;

    document
        .getElementById("connectWalletBtn")
        .onclick = connectTonWallet;

    return;

}

    // ===========================
    // УСЛУГИ
    // ===========================

    if (tab === "services") {

        box.innerHTML = `

<div class="operation-card">

🚧 Управление услугами появится позже.

</div>

`;

        return;

    }

    // ===========================
    // УВЕДОМЛЕНИЯ
    // ===========================

    if (tab === "notifications") {

        box.innerHTML = `

<div class="operation-card">

🔔 Настройки уведомлений появятся позже.

</div>

`;

        return;

    }

    // ===========================
    // СИСТЕМА
    // ===========================

    if (tab === "system") {

        box.innerHTML = `

<div class="setting-item">

<label>Режим работы</label>

<select id="mode">

<option value="auto">Автоматический</option>

<option value="manual">Ручной</option>

</select>

</div>

<div class="setting-item">

<label>Курс TON</label>

<input
id="tonRate"
type="number"
placeholder="Например 295">

</div>

<div class="setting-item">

<label>Курс Stars</label>

<input
id="starsRate"
type="number"
placeholder="Например 1.82">

</div>

<button class="save-button">

💾 Сохранить

</button>

`;

        return;

    }

}

async function savePrices() {

    const body = {

        ...settings,

        stars50: Number(document.getElementById("stars50").value),
        stars75: Number(document.getElementById("stars75").value),
        stars100: Number(document.getElementById("stars100").value),
        stars150: Number(document.getElementById("stars150").value),
        stars250: Number(document.getElementById("stars250").value),
        stars500: Number(document.getElementById("stars500").value),
        stars1000: Number(document.getElementById("stars1000").value)

    };

    try {

        console.log("ОТПРАВЛЯЕМ:");
console.log(body);

const result = await API.saveSettings(body);

console.log("ОТВЕТ СЕРВЕРА:");
console.log(result);

        settings = body;

        alert("✅ Настройки сохранены");

    } catch (e) {

    console.error(e);

    alert(
        "Ошибка сохранения\n\n" +
        "message: " + e.message +
        "\n\n" +
        "stack:\n" + (e.stack || "нет")
    );

}

}

window.Settings = {

    loadSettings,
    switchSettings

};
async function connectTonWallet() {

    try {

        const unsubscribe = connector.onStatusChange(async wallet => {

            if (!wallet) return;

            unsubscribe();

            const address = wallet.account.address;

            settings.ton_wallet = address;

            await API.saveSystem({
                ton_wallet: address,
                ton_rate: settings.ton_rate,
                stars_rate: settings.stars_rate,
                mode: settings.mode,
                sales_enabled: settings.sales_enabled,
                deposits_enabled: settings.deposits_enabled,
                referrals_enabled: settings.referrals_enabled,
                balance_payment_enabled: settings.balance_payment_enabled
            });

            renderSettings("wallet");

        });

        await connector.openModal();

    } catch (err) {

        console.error(err);

    }

}