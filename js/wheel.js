let spinning = false;


let prizes = [];

const wheel =
document.getElementById("wheel");


const button =
document.getElementById("spinBtn");



button.onclick = async ()=>{


if(spinning)
return;



spinning=true;

button.disabled=true;



const rotate =
3600 + Math.floor(Math.random()*360);



wheel.style.transform =
`rotate(${rotate}deg)`;



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



setTimeout(()=>{


if(data.success){


document.getElementById(
"lastPrize"
)
.innerText =
data.prize.name;


}else{


alert(data.message);

}


button.disabled=false;

spinning=false;


},5000);



}catch(err){


console.error(err);


button.disabled=false;

spinning=false;


}



};