const WHEEL_API =
"https://white-stars-api.onrender.com/api/wheel/admin";


// =======================
// Загрузка призов
// =======================

async function loadWheelPrizes(){

    try{

        const res = await fetch(
            WHEEL_API + "/prizes"
        );

        const data = await res.json();


        const box =
        document.getElementById("wheelList");


        if(!box) return;


        box.innerHTML="";


        data.prizes.forEach(prize=>{


            box.innerHTML += `

            <div class="wheel-item">


                <div style="
                display:flex;
                align-items:center;
                gap:10px;
                ">


                <div style="
                width:22px;
                height:22px;
                border-radius:6px;
                background:${prize.color};
                ">
                </div>


                <b>${prize.name}</b>


                </div>



                <p>
                🎁 Тип:
                ${prize.type}
                </p>


                <p>
                ⭐ Значение:
                ${prize.value}
                </p>


                <p>
                🎯 Шанс:
                ${prize.chance}%
                </p>


                <p>
                🏆 Выиграно:
                ${prize.wins || 0}
                раз
                </p>



                <button onclick="
                deleteWheelPrize(${prize.id})
                ">
                🗑 Удалить
                </button>


            </div>

            `;


        });


    }catch(err){

        console.error(
            "Wheel admin error:",
            err
        );

    }

}



// =======================
// Добавление
// =======================

async function addWheelPrize(){


const data = {


name:
document.getElementById("wheelName").value,


type:
document.getElementById("wheelType").value,


value:
Number(
document.getElementById("wheelValue").value
),


chance:
Number(
document.getElementById("wheelChance").value
),


color:
document.getElementById("wheelColor")?.value
||
"#ffffff"


};



await fetch(

WHEEL_API + "/prizes",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

}

);



loadWheelPrizes();


}




// =======================
// Удаление
// =======================

async function deleteWheelPrize(id){


await fetch(

WHEEL_API + "/prizes/"+id,

{

method:"DELETE"

}

);



loadWheelPrizes();


}





document.addEventListener(
"DOMContentLoaded",
()=>{


const btn =
document.getElementById(
"addWheelPrizeBtn"
);



if(btn){

btn.onclick =
addWheelPrize;

}



loadWheelPrizes();


});