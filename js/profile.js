const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const API = "https://white-stars-api.onrender.com";

const user = tg.initDataUnsafe?.user;


let refLink = "";



async function loadProfile(){


    if(!user){

        alert("Telegram user not found");

        return;

    }


    try{


        const response = await fetch(
            `${API}/api/users/${user.id}`
        );


        const data = await response.json();



        if(!data.success){

            console.error("Profile load failed");

            return;

        }



        const u = data.user;



        // Имя

        document.getElementById("name")
        .innerText =
        `${u.first_name || ""} ${u.last_name || ""}`;



        // Username

        document.getElementById("username")
        .innerText =
        "@" + (u.username || "user");



        // Баланс

        document.getElementById("balance")
        .innerText =
        Number(u.balance).toFixed(2)
        + " ⭐";



        // Статистика

        document.getElementById("spent")
        .innerText =
        Number(u.total_spent || 0)
        .toFixed(2);



        document.getElementById("deposit")
        .innerText =
        Number(u.total_deposit || 0)
        .toFixed(2);



        document.getElementById("refs")
        .innerText =
        u.referral_count || 0;



        // Аватар

        if(u.avatar){

            document.getElementById("avatar")
            .src = u.avatar;

        }



        // Реферальная ссылка

        refLink =
        `https://t.me/WHITE_STARS_BOT?start=${u.telegram_id}`;



        const refElement =
        document.getElementById("refLink");


        if(refElement){

            refElement.innerText = refLink;

        }



    }catch(err){


        console.error(
            "PROFILE ERROR:",
            err
        );


    }


}




// Копирование реферальной ссылки

async function copyRefLink(){


    if(!refLink){

        alert("Ссылка еще не загрузилась");

        return;

    }



    try{


        await navigator.clipboard.writeText(refLink);


        alert(
            "✅ Реферальная ссылка скопирована"
        );


    }catch(err){


        console.error(err);


        alert(
            "Не удалось скопировать ссылку"
        );


    }


}




function goBack(){

    history.back();

}




loadProfile();