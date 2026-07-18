console.log("🔥 WHEEL START");

window.onerror = function (message, source, line, col, error) {
    console.error("❌ JS ERROR:", {
        message,
        source,
        line,
        col,
        error
    });
};

const API = "https://white-stars-api.onrender.com";

let spinning = false;
let prizes = [];

const wheel = document.getElementById("wheel");
const button = document.getElementById("spinBtn");
const buyBtn = document.getElementById("buySpinBtn");

// =====================
// Telegram
// =====================

const tg = window.Telegram?.WebApp || null;

if (tg) {
    try {
        tg.ready?.();
        tg.expand?.();
    } catch (e) {
        console.error("Telegram init error", e);
    }
}

function getUser() {
    return tg?.initDataUnsafe?.user ?? null;
}

// =====================
// API helper
// =====================

async function api(url, options = {}) {

    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
}

// =====================
// Купить спин
// =====================

if (buyBtn) {

    buyBtn.onclick = async () => {

        try {

            const user = getUser();

            if (!user) {
                alert("Откройте рулетку через Telegram.");
                return;
            }

            const data = await api(API + "/api/wheel/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    telegram_id: user.id
                })
            });

            alert(
                data.success
                    ? "Спин куплен"
                    : data.message
            );

            await loadInfo();

        } catch (e) {

            console.error(e);

            alert("Ошибка покупки спина");

        }

    };

}

// =====================
// Загрузка рулетки
// =====================

async function loadWheel() {

    try {

        const data = await api(API + "/api/wheel");
alert("WHEEL DATA: " + JSON.stringify(data))
        if (!data.success) {
            throw new Error(data.message || "Wheel API error");
        }

        if (!Array.isArray(data.prizes)) {
            throw new Error("Prizes is not array");
        }

        prizes = data.prizes;

        if (!prizes.length) {

            wheel.innerHTML = "<h3>Нет доступных призов</h3>";

            return;

        }

        createWheel();

        renderPrizeList();

    } catch (err) {

        console.error(err);

        wheel.innerHTML = `
            <div style="padding:20px;text-align:center">
                ❌ Не удалось загрузить рулетку
            </div>
        `;

    }

}

// ======================
// Список призов
// ======================

function renderPrizeList() {

    const box = document.getElementById("prizeList");

    if (!box) return;

    box.innerHTML = "";

    prizes.forEach((p, i) => {

        box.innerHTML += `
        <div class="prize-item"
             onclick="showPrize(${i})">

            <div
                class="color-box"
                style="background:hsl(${i * 55},80%,60%)">
            </div>

            <div>

                <b>${p.name}</b>

                <br>

                <small>
                    Шанс: ${p.chance}%
                </small>

            </div>

        </div>
        `;

    });

}

// =====================
// Создание круга
// =====================

function createWheel() {

    if (!wheel) return;

    if (!prizes.length) return;

    let gradient = "conic-gradient(";

    let current = 0;

    prizes.forEach((p, i) => {

        const chance = Number(p.chance);

        const start = current;

        const end = current + chance * 3.6;

        gradient += `
hsl(${i * 55},80%,60%) ${start}deg ${end}deg,
`;

        current = end;

    });

    gradient = gradient.slice(0, -1) + ")";

    wheel.style.background = gradient;

    alert(gradient);

}
// =====================
// Крутить
// =====================

if (button) {

    button.onclick = async () => {

        if (spinning) return;

        const user = getUser();

        if (!user) {
            alert("Откройте рулетку через Telegram.");
            return;
        }

        spinning = true;

        button.disabled = true;
        button.innerText = "🎡 Крутим...";

        try {

            const data = await api(API + "/api/wheel/spin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    telegram_id: user.id
                })
            });

            if (!data.success) {
                alert(data.message || "Ошибка");
                resetButton();
                return;
            }

            const prize = data.prize;

            if (!prize) {
                throw new Error("Prize not received");
            }

            let start = 0;

            for (let i = 0; i < prize.index; i++) {

                start += Number(prizes[i].chance) * 3.6;

            }

            const angle =
                start +
                Number(prize.chance) * 3.6 / 2;

            const rotate = 3600 - angle;

            wheel.style.transition =
                "transform 5s cubic-bezier(.17,.67,.19,1)";

            wheel.style.transform =
                `rotate(${rotate}deg)`;

            setTimeout(async () => {

                const lastPrize =
                    document.getElementById("lastPrize");

                if (lastPrize)
                    lastPrize.innerText = prize.name;

                alert(`🎉 Вы выиграли: ${prize.name}`);

                resetButton();

                await loadInfo();

            }, 5000);

        } catch (err) {

            console.error(err);

            alert("Ошибка рулетки");

            resetButton();

        }

    };

}

// =====================
// Сброс кнопки
// =====================

function resetButton() {

    spinning = false;

    if (!button) return;

    button.disabled = false;

    button.innerText = "🎡 Крутить";

}

// =====================
// Информация
// =====================

async function loadInfo() {

    const user = getUser();

    if (!user) {
        console.warn("Telegram user not found");
        return;
    }

    try {

        const data = await api(
            `${API}/api/wheel/info/${user.id}`
        );

        if (!data.success)
            return;

        const spins =
            document.getElementById("spins");

        if (spins)
            spins.innerText = data.spins;

        const cooldown =
            document.getElementById("cooldown");

        if (cooldown) {

            if (data.cooldown === 0) {

                cooldown.innerText = "Доступен";

            } else {

                const h =
                    Math.floor(data.cooldown / 3600);

                const m =
                    Math.floor(
                        (data.cooldown % 3600) / 60
                    );

                cooldown.innerText =
                    `Следующий free спин через ${h}ч ${m}м`;

            }

        }

        const canSpin =
            data.spins > 0 ||
            data.cooldown === 0;

        if (button) {

            button.disabled = !canSpin;

            button.innerText =
                canSpin
                    ? "🎡 Крутить"
                    : "Нет спинов";

        }

    } catch (err) {

        console.error("loadInfo:", err);

    }

}

// =====================
// Информация о призе
// =====================

function showPrize(index) {

    const p = prizes[index];

    if (!p) return;

    alert(`
🎁 ${p.name}

Шанс:
${p.chance}%

Тип:
${p.type}

Награда:
${p.value}
`);

}

// =====================
// Старт
// =====================

console.log("🔥 BEFORE LOAD");

(async () => {

    try {

        await loadWheel();

        console.log("✅ WHEEL LOADED");

        await loadInfo();

        console.log("✅ INFO LOADED");

    } catch (err) {

        console.error("INIT ERROR", err);

    }

})();