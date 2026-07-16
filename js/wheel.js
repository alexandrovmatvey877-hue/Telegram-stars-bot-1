console.log("🔥 WHEEL START");

window.onerror = function(message, source, line){
    console.error(
        "❌ JS ERROR:",
        message,
        source,
        line
    );
};

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

if (buyBtn) {
buyBtn.onclick = async()=>{

    const user =
Telegram.WebApp?.initDataUnsafe?.user;

if(!user){
    alert("Telegram user not found");
    return;
}


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

}

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
        renderPrizeList();
    }

}


// ======================
// Создание листа информации
// ======================
function renderPrizeList(){

    const box =
    document.getElementById("prizeList");


    if(!box)
        return;


    box.innerHTML="";


    prizes.forEach((p,i)=>{


        box.innerHTML += `

        <div class="prize-item"
        onclick="showPrize(${i})">


            <div class="color-box"
            style="
            background:hsl(${i*55},80%,60%)
            ">
            </div>


            <div>

                <b>
                ${p.name}
                </b>

                <br>

                <small>
                Шанс: ${p.chance}%
                </small>

            </div>


        </div>

        `;


    });


}


// =====================
// Создание круга
// =====================

function createWheel(){

    if(!prizes.length)
        return;


    let gradient = "conic-gradient(";


    let current = 0;


    prizes.forEach((p,i)=>{


        const chance = Number(p.chance);


        const start = current;


        const end = current + (chance * 3.6);



        gradient += `
        hsl(${i * 55},80%,60%)
        ${start}deg
        ${end}deg,
        `;


        current = end;


    });



    gradient =
    gradient.slice(0,-1) + ")";


    wheel.style.background = gradient;


}




// =====================
// Крутить
// =====================

if (button) {
button.onclick = async()=>{


    if(spinning)
    return;


    spinning=true;

    button.disabled=true;
    button.innerText="🎡 Крутим...";


    try{


        const user =
Telegram.WebApp?.initDataUnsafe?.user;

if(!user){
    alert("Telegram user not found");
    return;
}



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



        let start = 0;

for(let i = 0; i < prize.index; i++){

    start += Number(prizes[i].chance) * 3.6;

}

const angle =
start +
(Number(prize.chance) * 3.6 / 2);



        const rotate =
        3600 - angle;



        wheel.style.transform =
        `rotate(${rotate}deg)`;




        setTimeout(()=>{


    document.getElementById(
        "lastPrize"
    ).innerText =
    prize.name;


    alert(
        "🎉 Вы выиграли: " + prize.name
    );


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

}


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

if(button){

    button.innerText =
    canSpin
    ? "🎡 Крутить"
    : "Нет спинов";
}

}
//хуй знает что, я ебу что ли?
function showPrize(index){

    const p = prizes[index];


    alert(
`
🎁 ${p.name}

Шанс:
${p.chance}%

Тип:
${p.type}

Награда:
${p.value}
`
    );

}



console.log("🔥 BEFORE LOAD");

loadWheel()
.then(()=>{
    console.log("✅ WHEEL LOADED");
})
.catch(err=>{
    console.error("❌ LOAD WHEEL ERROR", err);
});


loadInfo()
.then(()=>{
    console.log("✅ INFO LOADED");
})
.catch(err=>{
    console.error("❌ LOAD INFO ERROR", err);
});