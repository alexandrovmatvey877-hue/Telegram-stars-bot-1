const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


let prices = {};

let selectedStars = 0;

let starRate = 0;


const PACKS = [
    50,
    75,
    100,
    150,
    250,
    350,
    500,
    750,
    1000,
    1500,
    2500,
    5000
];


// =======================
// Загрузка цен
// =======================

async function loadPrices(){

    const res = await fetch(
        "https://white-stars-api.onrender.com/api/settings"
    );


    const data = await res.json();



    prices = {

        50:data.stars50,
        75:data.stars75,
        100:data.stars100,
        150:data.stars150,
        250:data.stars250,
        500:data.stars500,
        1000:data.stars1000

    };


    // считаем курс 1 звезды
    starRate =
        prices[100] / 100;


    createButtons();


    updateCalculator();

}




// =======================
// Кнопки пакетов
// =======================

function createButtons(){


    const box =
    document.getElementById("packs");



    PACKS.forEach(stars=>{


        const btn =
        document.createElement("button");


        btn.innerText =
        stars+" ⭐";



        btn.onclick = ()=>{


            selectedStars = stars;


            updateCalculator();


        };



        box.appendChild(btn);


    });


}




// =======================
// Калькулятор
// =======================

function updateCalculator(){


    let price =
    selectedStars * starRate;



    document.getElementById("starsAmount")
    .innerText =
    selectedStars+" ⭐";



    document.getElementById("price")
    .innerText =
    price.toFixed(2)+" ₽";



    document.getElementById("rate")
    .innerText =
    starRate.toFixed(2)+" ₽";

}





// =======================
// Покупка
// =======================

function buyStars(){


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



    if(!selectedStars){

        tg.showAlert(
            "Выберите количество Stars"
        );

        return;

    }



    console.log({

        username,
        stars:selectedStars,
        price:selectedStars*starRate

    });



    // временная заглушка

    tg.showAlert(
        "Недостаточно средств"
    );


}




loadPrices();