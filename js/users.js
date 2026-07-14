let users = [];


// =======================
// Загрузка пользователей
// =======================

async function loadUsers() {

    try {

        users = await API.getUsers();

        markCurrentUserOnline();

        renderUsers(users);


    } catch (e) {


        console.error(e);


        document.getElementById("usersList").innerHTML = `

        <div class="operation-card">

        ❌ ${e.message}

        </div>

        `;

    }

}





// =======================
// Отметить себя онлайн
// =======================

function markCurrentUserOnline() {


    if (!window.Telegram || !Telegram.WebApp)
        return;



    const tg = Telegram.WebApp.initDataUnsafe?.user;


    if (!tg)
        return;



    const me = users.find(
        u => String(u.telegram_id) === String(tg.id)
    );



    if (me) {

        me.online = true;

        me.last_seen = Date.now();

    }


}





// =======================
// Рендер пользователей
// =======================

function renderUsers(list) {


    const box = document.getElementById("usersList");


    if (!box)
        return;



    if (!list.length) {


        box.innerHTML = `

        <div class="operation-card">

        Пользователи не найдены

        </div>

        `;


        return;

    }



    box.innerHTML = "";




    list.forEach(user => {



        const avatar =
            user.avatar ||
            "images/avatar.png";




        const username =

            user.username

            ||

            `${user.first_name || ""} ${user.last_name || ""}`.trim()

            ||

            "Без имени";





        const status = user.online

            ? `<span class="online">🟢 В сети</span>`

            : `<span class="offline">⚫ Не в сети</span>`;





        const referrals =
            user.referral_count || 0;





        const referrer =

            user.referrer_username

            ? `@${user.referrer_username}`

            :

            user.referrer_name

            ?

            user.referrer_name

            :

            "Нет";






        box.innerHTML += `



<div class="user-card"

onclick="openProfile('${user.telegram_id}')">





<div class="user-left">





<img

class="avatar"

src="${avatar}"

onerror="this.src='images/avatar.png'"

>





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





<div class="referrals">

👥 Рефералы: ${referrals}

</div>





<div class="referrer">

📌 Пригласил: ${referrer}

</div>





</div>





</div>







<div class="user-right">





<div class="balance">

${Number(user.balance || 0).toFixed(2)} ₽

</div>





<div class="arrow">

›

</div>





</div>





</div>



`;



    });



}







// =======================
// Фильтр пользователей
// =======================

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



            String(u.telegram_id)

                .includes(text)



            ||



            (u.username || "")

                .toLowerCase()

                .includes(text)



            ||



            (u.first_name || "")

                .toLowerCase()

                .includes(text)



            ||



            (u.referrer_username || "")

                .toLowerCase()

                .includes(text)



        );



    }







    switch(sort) {



        case "balance":


            list.sort(
                (a,b)=>
                (b.balance||0)
                -
                (a.balance||0)
            );

        break;





        case "last_seen":


            list.sort(
                (a,b)=>
                new Date(b.last_seen || 0)
                -
                new Date(a.last_seen || 0)
            );


        break;





        case "registered":


            list.sort(
                (a,b)=>
                new Date(b.registered_at || 0)
                -
                new Date(a.registered_at || 0)
            );


        break;





        case "deposit":


            list.sort(
                (a,b)=>
                (b.total_deposit||0)
                -
                (a.total_deposit||0)
            );


        break;





        case "spent":


            list.sort(
                (a,b)=>
                (b.total_spent||0)
                -
                (a.total_spent||0)
            );


        break;





        case "referrals":


            list.sort(
                (a,b)=>
                (b.referral_count||0)
                -
                (a.referral_count||0)
            );


        break;



    }





    renderUsers(list);


}







// =======================
// Открытие профиля
// =======================

function openProfile(id){


    location.href = `profile.html?id=${id}`;


}







window.Users = {


    loadUsers,

    filterUsers


};