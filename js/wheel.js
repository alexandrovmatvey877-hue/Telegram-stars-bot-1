let spinning = false;


function spinWheel(){


if(spinning)
return;


spinning=true;


const wheel =
document.getElementById("wheel");


const rotate =
Math.floor(Math.random()*3600)+720;


wheel.style.transform =
`rotate(${rotate}deg)`;


setTimeout(()=>{


document.getElementById("result")
.innerText =
"🎉 Результат проверяется сервером";


spinning=false;


},5000);


}