const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const user = tg.initDataUnsafe.user;


async function activatePromo(){


    const code = document
        .getElementById("promo")
        .value
        .trim();



    const result = document.getElementById("result");



    if(!code){

        result.innerText="Введите промокод";

        return;

    }



    try{


        const response = await fetch(

        "https://white-stars-api.onrender.com/api/promocodes/use",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                code:code,

                telegram_id:String(user.id)

            })

        });



        const data = await response.json();



        if(data.success){


            result.innerText =
            "✅ +" + data.reward + " ₽ начислено";


        }else{


            result.innerText =
            "❌ " + data.message;


        }



    }catch(err){

        console.error(err);

        result.innerText =
        "Ошибка сервера";

    }


}