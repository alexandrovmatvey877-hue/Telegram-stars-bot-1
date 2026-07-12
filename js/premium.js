const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


let prices = {};
console.log("PREMIUM JS LOADED");

let selectedPeriod = 0;


// =======================
// Загрузка Premium цен
// =======================

async function loadPremium(){

    try {

        const res = await fetch(
            "https://white-stars-api.onrender.com/api/premium"
        );
console.log("PREMIUM RESPONSE:", res.status);

        const data = await res.json();
        console.log("PREMIUM DATA:", data);


        if(!data.success){

            tg.showAlert(
                "Ошибка загрузки цен"
            );

            return;

        }


        prices = data.prices;


        createButtons();

        updateCalculator();


    } catch(err){

        console.error(err);

        tg.showAlert(
            "Не удалось загрузить цены"
        );

    }

}



// =======================
// Кнопки сроков
// =======================

function createButtons(){


    const box =
    document.getElementById("periods");


    box.innerHTML = "";


    const periods = [
        {
            id:3,
            name:"3 месяца"
        },
        {
            id:6,
            name:"6 месяцев"
        },
        {
            id:12,
            name:"12 месяцев"
        }
    ];



    periods.forEach(period=>{


        const btn =
        document.createElement("button");


        btn.innerText =
        period.name;



        btn.onclick = ()=>{


            selectedPeriod =
            period.id;


            updateCalculator();


        };


        box.appendChild(btn);


    });

}



// =======================
// Калькулятор
// =======================

function updateCalculator(){


    const price =
    prices[selectedPeriod] || 0;



    document.getElementById(
        "period"
    ).innerText =
    selectedPeriod ?
    selectedPeriod + " месяцев" :
    "Не выбрано";



    document.getElementById(
        "price"
    ).innerText =
    Number(price).toFixed(2)
    + " TON";

}



// =======================
// Покупка
// =======================

function buyPremium(){


    const username =
    document
    .getElementById("username")
    .value
    .trim();



    if(!username){

        tg.showAlert(
            "Введите получателя"
        );

        return;

    }



    if(!selectedPeriod){

        tg.showAlert(
            "Выберите срок Premium"
        );

        return;

    }



    console.log({

        username,

        months:selectedPeriod,

        price:prices[selectedPeriod]

    });



    // временно для проверки терминала

    tg.showAlert(
        "Недостаточно средств"
    );


}

function goBack() {

    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "../index.html";
    }

}


loadPremium();