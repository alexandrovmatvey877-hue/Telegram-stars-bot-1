const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const user = tg.initDataUnsafe.user;


async function loadProfile(){


    if(!user){

        alert("Telegram user not found");

        return;

    }


    try{


        const response = await fetch(

            `https://white-stars-api.onrender.com/api/users/${user.id}`

        );


        const data = await response.json();



        if(!data.success){

            return;

        }



        const u = data.user;



        document.getElementById("name")
        .innerText =
        `${u.first_name || ""} ${u.last_name || ""}`;



        document.getElementById("username")
        .innerText =
        "@" + (u.username || "user");



        document.getElementById("balance")
        .innerText =
        Number(u.balance).toFixed(2)
        + " ⭐";



        document.getElementById("spent")
        .innerText =
        u.total_spent;



        document.getElementById("deposit")
        .innerText =
        u.total_deposit;



        document.getElementById("refs")
        .innerText =
        u.referral_count;



        if(u.avatar){

            document.getElementById("avatar")
            .src = u.avatar;

        }



    }catch(err){

        console.error(err);

    }


}



function goBack(){

    history.back();

}


loadProfile();