let spinning = false;


let prizes = [];

const wheel =
document.getElementById("wheel");


const button =
document.getElementById("spinBtn");

document
.getElementById("buySpinBtn")
.onclick = async()=>{

const user =
Telegram.WebApp
.initDataUnsafe.user;

const res =
await fetch(

"https://white-stars-api.onrender.com/api/wheel/buy",

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

?

"Спин куплен"

:

data.message

);

};

async function loadWheel(){


const res =
await fetch(
"https://white-stars-api.onrender.com/api/wheel"
);


const data =
await res.json();


if(data.success){

prizes=data.prizes;


createWheel();

}


}

function createWheel(){


const step =
360 / prizes.length;


let gradient =
"conic-gradient(";


prizes.forEach((p,i)=>{


gradient +=
`
hsl(${i*50},80%,60%)
${i*step}deg
${(i+1)*step}deg,
`;

});


gradient =
gradient.slice(0,-1);


gradient += ")";


wheel.style.background =
gradient;


}



loadWheel();
loadInfo();

button.onclick = async ()=>{


if(spinning)
return;



spinning=true;

button.disabled = true;
button.innerText = "Крутим...";

try{


const user =
window.Telegram.WebApp
.initDataUnsafe.user;



const response =
await fetch(
"https://white-stars-api.onrender.com/api/wheel/spin",
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

const step = 360 / data.prize.total;

const angle =
(data.prize.index * step) + step / 2;

const rotate =
3600 - angle;

wheel.style.transform =
`rotate(${rotate}deg)`;

setTimeout(()=>{

if(data.success){

document.getElementById(
"lastPrize"
)
.innerText =
data.prize.name;

loadInfo();

}else{

alert(data.message);

}

spinning = false;

loadInfo();

},5000);



}catch(err){


console.error(err);


button.disabled=false;

spinning=false;


}



};

async function loadInfo(){

const user =
Telegram.WebApp.initDataUnsafe.user;

const res =
await fetch(
`https://white-stars-api.onrender.com/api/wheel/info/${user.id}`
);

const data =
await res.json();

if(!data.success) return;

document.getElementById("spins").innerText =
data.spins;

if(data.cooldown===0){

document.getElementById("cooldown").innerText =
"Доступен";

const canSpin =
data.spins > 0 || data.cooldown === 0;

button.disabled = !canSpin;

if(canSpin){

button.innerText =
"🎡 Крутить";

}else{

button.innerText =
"Нет спинов";

}

}else{

const h =
Math.floor(data.cooldown/3600);

const m =
Math.floor((data.cooldown%3600)/60);

document.getElementById("cooldown").innerText =
`${h}ч ${m}м`;

}

}