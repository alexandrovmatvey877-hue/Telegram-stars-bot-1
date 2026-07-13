const db = require("../config/database");


async function getPrizes(){

const result = await db.query(`

SELECT *

FROM wheel_prizes

WHERE enabled=true

`);

return result.rows;

}



function randomPrize(prizes){


let total = 0;


prizes.forEach(p=>{

total += Number(p.chance);

});


let random = Math.random()*total;


for(const prize of prizes){


random -= Number(prize.chance);


if(random <= 0){

return prize;

}


}


return prizes[0];

}



async function spin(telegram_id){


const db = require("../config/database");


// настройки

const settings =
await db.query(`

SELECT *

FROM wheel_settings

WHERE id=1

`);


const cost =
Number(settings.rows[0].cost || 0);



if(cost > 0){


const user =
await db.query(`

SELECT balance

FROM users

WHERE telegram_id=$1

`,[
telegram_id
]);



if(!user.rows.length){

throw new Error("User not found");

}



if(Number(user.rows[0].balance) < cost){

throw new Error("Недостаточно средств");

}



await db.query(`

UPDATE users

SET balance = balance - $1

WHERE telegram_id=$2

`,[
cost,
telegram_id
]);


}



// выбираем приз


const prizes =
await getPrizes();



if(!prizes.length){

throw new Error("No prizes");

}



const prize =
randomPrize(prizes);




// история


await db.query(`

INSERT INTO wheel_history(

telegram_id,

prize_id,

prize_name

)

VALUES($1,$2,$3)

`,[

telegram_id,

prize.id,

prize.name

]);




// выдача Stars


if(prize.type === "stars"){


await db.query(`

UPDATE users

SET balance = balance + $1

WHERE telegram_id=$2

`,[

prize.value,

telegram_id

]);


}



return prize;


}



module.exports={

spin,

getPrizes

};