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

    // ---------- вкладки ----------
    document.querySelectorAll(".settings-tab").forEach(tab => {

    tab.onclick = () => {

        // сначала открыть страницу настроек
        switchPage("settings");

        // затем открыть нужный раздел
        Settings.switchSettings(tab.dataset.settings);

    };

});

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
// ЗАДНИЦА ХАХАХА 6767 ПОКОЕ ОКАК