let spinning = false;


async function spinWheel(){


const user =
window.Telegram.WebApp
.initDataUnsafe.user;


if(!user){

alert("Telegram user error");

return;

}



const wheel =
document.getElementById("wheel");


wheel.style.transform =
`rotate(${3600}deg)`;



try{


const res =
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
await res.json();



setTimeout(()=>{


if(data.success){


document.getElementById("result")
.innerText =
"🎉 Вы выиграли: "
+
data.prize.name;


}else{


document.getElementById("result")
.innerText =
"Ошибка";


}


},5000);



}catch(err){


console.error(err);


}

}