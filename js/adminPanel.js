document.addEventListener("DOMContentLoaded", () => {

    // ---------- кнопка назад ----------
    const homeBtn = document.getElementById("homeBtn");

    if (homeBtn) {

        homeBtn.onclick = () => {
            location.href = "index.html";
        };

    }

    // ---------- кнопка обновления ----------
    const reloadBtn = document.getElementById("reloadBtn");

    if (reloadBtn) {

        reloadBtn.onclick = () => {

            if (currentPage === "users") {

               Users.loadUsers();

            } else if (currentPage === "settings") {

                Settings.loadSettings();

            } else if (currentPage === "operations") {

                Operations.loadOperations();

            }

        };

    }

    // ---------- поиск ----------
    const search = document.getElementById("searchInput");

    if (search) {

        search.addEventListener("input", () => {

            Users.filterUsers();

        });

    }

    // ---------- сортировка ----------
    const sort = document.getElementById("sortSelect");

    if (sort) {

        sort.addEventListener("change", () => {

            Users.filterUsers();

        });

    }
// ---------- верхние вкладки ----------
document.querySelectorAll(".tab").forEach(tab => {

    tab.onclick = () => {

        switchPage(tab.dataset.page);

    };

});
document.querySelectorAll(".settings-tab").forEach(tab => {

    tab.onclick = () => {

        Settings.switchSettings(tab.dataset.settings);

    };

});

    // ---------- вкладки --------------

    // ---------- вкладки настроек ----------

    // ---------- первая загрузка ----------
    Users.loadUsers();
Settings.loadSettings();

});

let currentPage = "users";

function switchPage(page) {

    currentPage = page;

    document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));

    document.querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));

    const pages = {
        users: "usersPage",
        operations: "operationsPage",
        settings: "settingsPage"
    };

    document.getElementById(pages[page]).classList.add("active");

    const btn = document.querySelector(`.tab[data-page="${page}"]`);

if (btn) {
    btn.classList.add("active");
}

    if (page === "users") {

        Users.loadUsers();
        Settings.loadSettings();

    }

    if (page === "settings") {

        Settings.loadSettings();

    }

    if (page === "operations") {

        Operations.loadOperations();

    }

}
// ======================
// SYSTEM STATUS
// ======================

function setSystemStatus(status, info = "") {

    const green = document.getElementById("statusGreen");
    const yellow = document.getElementById("statusYellow");
    const red = document.getElementById("statusRed");

    const title = document.getElementById("statusTitle");
    const text = document.getElementById("statusInfo");

    if (!green) return;

    green.classList.remove("active");
    yellow.classList.remove("active");
    red.classList.remove("active");

    switch (status) {

        case "normal":

            green.classList.add("active");
            title.textContent = "NORMAL";
            text.textContent = info || "Все системы работают";
            break;

        case "warning":

            yellow.classList.add("active");
            title.textContent = "WARNING";
            text.textContent = info || "Обнаружены проблемы";
            break;

        case "emergency":

            red.classList.add("active");
            title.textContent = "EMERGENCY";
            text.textContent = info || "Продажи остановлены";
            break;

    }

}
async function loadSystemStatus(){

    try {

        const response = await fetch("/admin/system");

        const data = await response.json();


        if(!data.success){
            return;
        }


        const system = data.system;


        if(system.status === "GREEN"){

            setSystemStatus(
                "normal",
                "Все системы работают"
            );

        }


        else if(system.status === "YELLOW"){

            setSystemStatus(
                "warning",
                "Есть предупреждения"
            );

        }


        else if(system.status === "RED"){

            setSystemStatus(
                "emergency",
                "Продажи остановлены"
            );

        }


    } catch(err){

        console.error(
            "SYSTEM STATUS ERROR:",
            err
        );

        setSystemStatus(
            "emergency",
            "Нет связи с сервером"
        );

    }

}