let users = [];

async function loadUsers() {

    try {

        users = await API.getUsers();

        markCurrentUserOnline();

        renderUsers(users);

    } catch (e) {

        console.error(e);

        document.getElementById("usersList").innerHTML =
        `<div class="operation-card">
            ❌ Ошибка загрузки пользователей
        </div>`;

    }

}

function markCurrentUserOnline() {

    if (!window.Telegram || !Telegram.WebApp) return;

    const tg = Telegram.WebApp.initDataUnsafe?.user;

    if (!tg) return;

    const me = users.find(u => String(u.telegram_id) === String(tg.id));

    if (me) {

        me.online = true;

        me.last_seen = Date.now();

    }

}

function renderUsers(list) {

    const box = document.getElementById("usersList");

    if (!box) return;

    if (!list.length) {

        box.innerHTML = `
        <div class="operation-card">
            Пользователи не найдены
        </div>`;

        return;

    }

    box.innerHTML = "";

    list.forEach(user => {

        const avatar = user.avatar || "images/avatar.png";

        const username =
            user.username ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "Без имени";

        const status = user.online
            ? `<span class="online">🟢 В сети</span>`
            : `<span class="offline">⚫ Не в сети</span>`;

        box.innerHTML += `

<div class="user-card"
onclick="openProfile('${user.telegram_id}')">

<div class="user-left">

<img
class="avatar"
src="${avatar}"
onerror="this.src='images/avatar.png'">

<div class="user-info">

<div class="status">
${status}
</div>

<div class="username">
${username}
</div>

<div class="userid">
ID: ${user.telegram_id}
</div>

</div>

</div>

<div class="user-right">

<div class="balance">
${user.balance || 0} ₽
</div>

<div class="arrow">
›
</div>

</div>

</div>

`;

    });

}

function filterUsers() {

    const text = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const sort = document
        .getElementById("sortSelect")
        .value;

    let list = [...users];

    if (text) {

        list = list.filter(u =>

            String(u.telegram_id).includes(text) ||

            (u.username || "")
            .toLowerCase()
            .includes(text) ||

            (u.first_name || "")
            .toLowerCase()
            .includes(text)

        );

    }

    switch (sort) {

        case "balance":
            list.sort((a,b)=>(b.balance||0)-(a.balance||0));
            break;

        case "last_seen":
            list.sort((a,b)=>(b.last_seen||0)-(a.last_seen||0));
            break;

        case "registered":
            list.sort((a,b)=>(b.registered_at||0)-(a.registered_at||0));
            break;

        case "deposit":
            list.sort((a,b)=>(b.total_deposit||0)-(a.total_deposit||0));
            break;

        case "spent":
            list.sort((a,b)=>(b.total_spent||0)-(a.total_spent||0));
            break;

    }

    renderUsers(list);

}

function openProfile(id){

    location.href = `profile.html?id=${id}`;

}

window.Users = {

    loadUsers,

    filterUsers

};