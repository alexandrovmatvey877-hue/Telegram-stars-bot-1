const WHEEL_API =
"https://white-stars-api.onrender.com/api/admin/wheel";

// =======================
// Заголовки
// =======================

function getHeaders() {

    return {

        "Content-Type": "application/json",

        "x-admin-key":
            localStorage.getItem("adminKey") || ""

    };

}

// =======================
// API helper
// =======================

async function api(url, options = {}) {

    const res = await fetch(url, options);

    if (!res.ok) {

        throw new Error(
            `${res.status} ${res.statusText}`
        );

    }

    return await res.json();

}

// =======================
// Загрузка призов
// =======================

async function loadWheelPrizes() {

    try {

        const data = await api(
            WHEEL_API + "/prizes",
            {
                headers: getHeaders()
            }
        );

        const box =
            document.getElementById("wheelList");

        if (!box) return;

        box.innerHTML = "";

        if (!data.success || !Array.isArray(data.prizes)) {

            box.innerHTML =
                "<p>Нет призов.</p>";

            return;

        }

        data.prizes.forEach(prize => {

            box.innerHTML += `

            <div class="wheel-item">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                ">

                    <div style="
                        width:22px;
                        height:22px;
                        border-radius:6px;
                        background:${prize.color};
                    "></div>

                    <b>${prize.name}</b>

                </div>

                <p>🎁 Тип: ${prize.type}</p>

                <p>⭐ Значение: ${prize.value}</p>

                <p>🎯 Шанс: ${prize.chance}%</p>

                <p>🏆 Выиграно: ${prize.wins || 0} раз</p>

                <button onclick="deleteWheelPrize(${prize.id})">
                    🗑 Удалить
                </button>

            </div>

            `;

        });

    } catch (err) {

        console.error("Wheel admin error:", err);

        const box =
            document.getElementById("wheelList");

        if (box) {

            box.innerHTML =
                `<p style="color:red">
                    Ошибка загрузки призов
                </p>`;

        }

    }

}

// =======================
// Добавление
// =======================

async function addWheelPrize() {

    try {

        const data = {

            name:
                document.getElementById("wheelName").value,

            type:
                document.getElementById("wheelType").value,

            value:
                Number(
                    document.getElementById("wheelValue").value
                ),

            chance:
                Number(
                    document.getElementById("wheelChance").value
                ),

            color:
                document.getElementById("wheelColor")?.value ||
                "#ffffff"

        };

        const result = await api(

            WHEEL_API + "/prizes",

            {

                method: "POST",

                headers: getHeaders(),

                body: JSON.stringify(data)

            }

        );

        if (!result.success) {

            alert(result.message || "Ошибка");

            return;

        }

        await loadWheelPrizes();

    } catch (err) {

        console.error(err);

        alert("Не удалось добавить приз.");

    }

}

// =======================
// Удаление
// =======================

async function deleteWheelPrize(id) {

    if (!confirm("Удалить приз?"))
        return;

    try {

        const result = await api(

            WHEEL_API + "/prizes/" + id,

            {

                method: "DELETE",

                headers: getHeaders()

            }

        );

        if (!result.success) {

            alert(result.message || "Ошибка удаления");

            return;

        }

        await loadWheelPrizes();

    } catch (err) {

        console.error(err);

        alert("Не удалось удалить приз.");

    }

}

// =======================
// Запуск
// =======================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const btn =
            document.getElementById(
                "addWheelPrizeBtn"
            );

        if (btn) {

            btn.onclick = addWheelPrize;

        }

        loadWheelPrizes();

    }

);