const WHEEL_API =
"https://white-stars-api.onrender.com/api/admin/wheel";



async function loadWheelPrizes(){


const res =
await fetch(
WHEEL_API + "/prizes"
);


const data =
await res.json();



const box =
document.getElementById("wheelList");


if(!box) return;



box.innerHTML="";



data.prizes.forEach(prize=>{


box.innerHTML += `

<div class="wheel-item">

<b>${prize.name}</b>

<br>

Тип: ${prize.type}

<br>

Количество: ${prize.value}

<br>

Шанс: ${prize.chance}%


<button onclick="deleteWheelPrize(${prize.id})">

Удалить

</button>


</div>

`;


});


}



async function addWheelPrize(){


await fetch(

WHEEL_API + "/prizes",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

name:
document.getElementById("wheelName").value,

type:
document.getElementById("wheelType").value,

value:
Number(document.getElementById("wheelValue").value),

chance:
Number(document.getElementById("wheelChance").value)

})

}

);



loadWheelPrizes();


}



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