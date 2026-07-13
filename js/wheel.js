let spinning = false;
let prizes = [];

const wheel = document.getElementById("wheel");
const button = document.getElementById("spinBtn");
const buyBtn = document.getElementById("buySpinBtn");

const API =
"https://white-stars-api.onrender.com";


// =====================
// Купить спин
// =====================

buyBtn.onclick = async()=>{

    const user =
    Telegram.WebApp.initDataUnsafe.user;


    const res = await fetch(
        API + "/api/wheel/buy",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                telegram_id:user.id
            })
        }
    );


    const data =
    await res.json();


    alert(
        data.success
        ? "Спин куплен"
        : data.message
    );


    loadInfo();

};



// =====================
// Загрузка рулетки
// =====================

async function loadWheel(){

    const res =
    await fetch(API+"/api/wheel");


    const data =
    await res.json();


    if(data.success){

        prizes=data.prizes;

        createWheel();

    }

}



// =====================
// Создание круга
// =====================

function createWheel(){

    if(!prizes.length)
    return;


    const step =
    360 / prizes.length;


    let gradient =
    "conic-gradient(";


    prizes.forEach((p,i)=>{

        gradient +=
        `hsl(${i*50},80%,60%)
        ${i*step}deg
        ${(i+1)*step}deg,`;

    });


    gradient =
    gradient.slice(0,-1)+")";


    wheel.style.background =
    gradient;

}




// =====================
// Крутить
// =====================

button.onclick = async()=>{


    if(spinning)
    return;


    spinning=true;

    button.disabled=true;
    button.innerText="🎡 Крутим...";


    try{


        const user =
        Telegram.WebApp
        .initDataUnsafe.user;



        const response =
        await fetch(
            API+"/api/wheel/spin",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    telegram_id:user.id
                })
            }
        );


        const data =
        await response.json();



        if(!data.success){

            alert(data.message);

            resetButton();

            return;

        }



        const prize =
        data.prize;



        const step =
        360 / prize.total;


        const angle =
        (prize.index * step)
        + step / 2;



        const rotate =
        3600 - angle;



        wheel.style.transform =
        `rotate(${rotate}deg)`;




        setTimeout(()=>{


            document.getElementById(
                "lastPrize"
            ).innerText =
            prize.name;



            resetButton();

            loadInfo();


        },5000);



    }catch(err){


        console.error(err);

        alert(
            "Ошибка рулетки"
        );


        resetButton();

    }


};




// =====================
// Сброс кнопки
// =====================

function resetButton(){

    spinning=false;

    button.disabled=false;

    button.innerText=
    "🎡 Крутить";

}



// =====================
// Информация
// =====================

async function loadInfo(){

    const user =
    Telegram.WebApp
    .initDataUnsafe.user;



    const res =
    await fetch(
        API+
        `/api/wheel/info/${user.id}`
    );


    const data =
    await res.json();



    if(!data.success)
    return;



    document.getElementById(
        "spins"
    ).innerText =
    data.spins;



    if(data.cooldown===0){


        document.getElementById(
            "cooldown"
        ).innerText =
        "Доступен";


    }else{


        const h =
        Math.floor(
            data.cooldown/3600
        );


        const m =
        Math.floor(
            (data.cooldown%3600)/60
        );



        document.getElementById(
            "cooldown"
        ).innerText =
        `Следующий free спин через ${h}ч ${m}м`;

    }


    const canSpin =
    data.spins > 0 ||
    data.cooldown===0;



    button.disabled =
    !canSpin;


    button.innerText =
    canSpin
    ? "🎡 Крутить"
    : "Нет спинов";


}



loadWheel();
loadInfo();