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


const prizes = await getPrizes();


if(!prizes.length){

throw new Error("No prizes");

}


const prize =
randomPrize(prizes);



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



return prize;


}



module.exports={

spin,

getPrizes

};