const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


let prices = {};

let selectedStars = 0;


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


// ======================
// Загрузка цен
// ======================

async function loadPrices(){

    try {


        const response = await fetch(
            "https://white-stars-api.onrender.com/api/settings"
        );


        const data = await response.json();


        prices = {

            50: data.stars50,
            75: data.stars75,
            100: data.stars100,
            150: data.stars150,
            250: data.stars250,
            500: data.stars500,
            1000: data.stars1000

        };


        console.log(
            "PRICES:",
            prices
        );


        loadPacks();


        updateCalculation();


    } catch(err){

        console.error(
            "PRICE LOAD ERROR:",
            err
        );


        tg.showAlert(
            "Ошибка загрузки цен"
        );

    }

}



// ======================
// Создание пакетов
// ======================

function loadPacks(){


    const container =
        document.getElementById("packs");


    if(!container)
        return;



    container.innerHTML = "";



    PACKS.forEach(amount => {


        const button =
            document.createElement("button");


        button.className =
            "pack";


        button.innerText =
            amount + " ⭐";



        button.onclick = () => {


            selectPack(
                amount,
                button
            );


        };



        container.appendChild(button);


    });


}




// ======================
// Выбор
// ======================

function selectPack(amount, button){


    selectedStars = amount;



    document
    .querySelectorAll(".pack")
    .forEach(btn => {

        btn.classList.remove("active");

    });



    button.classList.add("active");



    updateCalculation();


}





// ======================
// Расчёт
// ======================

function updateCalculation(){


    const price =
        prices[selectedStars] || 0;



    const rate =
        selectedStars
        ? price / selectedStars
        : 0;



    document.getElementById("starsAmount")
        .innerText =
        selectedStars + " ⭐";



    document.getElementById("price")
        .innerText =
        price.toFixed(2) + " ₽";



    document.getElementById("rate")
        .innerText =
        "1 ⭐ = " +
        rate.toFixed(2) +
        " ₽";


}





// ======================
// Покупка
// ======================

function buyStars(){


    const username =
        document
        .getElementById("username")
        .value
        .trim();



    if(!username){

        tg.showAlert(
            "Введите username получателя"
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

        receiver: username,
        stars: selectedStars,
        price: prices[selectedStars]

    });



    tg.showAlert(
        "Недостаточно средств"
    );


}




document.addEventListener(
"DOMContentLoaded",
loadPrices
);