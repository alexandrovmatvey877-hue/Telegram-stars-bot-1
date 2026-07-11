// ======================
// WHITE STARS
// Telegram Stars purchase
// ======================


const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// Временно
// Потом будем брать из API /api/settings
const STAR_PRICE = 1.27;


// Разрешённые пакеты
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


let selectedStars = 0;



// ======================
// Создание кнопок пакетов
// ======================

function loadPacks(){

    const container = document.getElementById("packs");

    if(!container) return;


    PACKS.forEach(amount => {


        const button = document.createElement("button");


        button.className = "pack";

        button.innerText = amount + " ⭐";


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
// Выбор пакета
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


    const stars =
        document.getElementById("starsAmount");


    const price =
        document.getElementById("price");



    if(stars){

        stars.innerText =
            selectedStars + " ⭐";

    }



    if(price){

        const total =
            selectedStars * STAR_PRICE;


        price.innerText =
            total.toFixed(2) + " ₽";

    }



    const rate =
        document.getElementById("rate");


    if(rate){

        rate.innerText =
            "1 ⭐ = " + STAR_PRICE + " ₽";

    }


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



    if(selectedStars === 0){


        tg.showAlert(
            "Выберите количество Stars"
        );


        return;

    }




    // Заглушка до подключения оплаты


    console.log({

        username,
        stars: selectedStars,
        price: selectedStars * STAR_PRICE

    });



    tg.showAlert(
        "Недостаточно средств"
    );


}




// ======================
// Старт
// ======================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPacks();

        updateCalculation();

    }
);