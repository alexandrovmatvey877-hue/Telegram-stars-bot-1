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
               Settings.loadSettings();

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

    }

    if (page === "settings") {

        Settings.loadSettings();

    }

    if (page === "operations") {

        Operations.loadOperations();

    }

}
// ЗАДНИЦА ХАХАХА 6767 ПОКОЕ ОКАК