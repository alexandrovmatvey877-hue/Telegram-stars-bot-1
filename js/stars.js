const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// =======================
// НАСТРОЙКИ
// =======================

const API =
"https://white-stars-api.onrender.com/api/settings";


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



let prices = {};

let selectedStars = 0;

let starRate = 0;



// =======================
// Загрузка цен
// =======================

async function loadPrices(){


    try {


        const response = await fetch(API);


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



        // курс одной звезды
        starRate =
            prices[100] / 100;



        createButtons();



        updateCalculator();



        console.log(
            "STARS PRICES:",
            prices
        );



    } catch(error){


        console.error(
            "PRICE LOAD ERROR:",
            error
        );


        tg.showAlert(
            "Не удалось загрузить цены"
        );


    }


}



// =======================
// Создание кнопок
// =======================

function createButtons(){


    const container =
    document.getElementById("packs");



    container.innerHTML = "";



    PACKS.forEach(stars => {



        const button =
        document.createElement("button");



        button.className =
        "pack-button";



        button.innerText =
        `${stars} ⭐`;



        button.onclick = ()=>{


            selectedStars = stars;


            updateCalculator();



            document
            .querySelectorAll(".pack-button")
            .forEach(btn =>
                btn.classList.remove("active")
            );


            button.classList.add("active");


        };



        container.appendChild(button);



    });


}




// =======================
// Калькулятор
// =======================

function updateCalculator(){


    let price = 0;



    if(selectedStars){


        if(prices[selectedStars]){


            price =
            prices[selectedStars];


        } else {


            // если пакета нет в БД
            // считаем через курс


            price =
            selectedStars * starRate;


        }


    }



    document.getElementById(
        "starsAmount"
    ).innerText =
    `${selectedStars} ⭐`;



    document.getElementById(
        "rate"
    ).innerText =
    `${starRate.toFixed(2)} ₽`;



    document.getElementById(
        "price"
    ).innerText =
    `${Math.ceil(price)} ₽`;



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



    const price =
    prices[selectedStars] ||
    Math.ceil(selectedStars * starRate);



    console.log({

        username,

        stars:selectedStars,

        price


    });



    // =====================
    // ВРЕМЕННО
    // =====================


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





loadPrices();