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

const user = await db.query(`
SELECT
balance,
wheel_spins,
last_spin
FROM users
WHERE telegram_id=$1
`, [telegram_id]);

if (!user.rows.length) {
    throw new Error("User not found");
}

const player = user.rows[0];

// Проверяем последнюю прокрутку

const lastSpin = await db.query(`

SELECT created_at

FROM wheel_history

WHERE telegram_id=$1

ORDER BY created_at DESC

LIMIT 1

`,[
telegram_id
]);


if(lastSpin.rows.length){


const last =
new Date(lastSpin.rows[0].created_at);


const now =
new Date();


const seconds =
(now-last)/1000;



if(seconds < 86400){

throw new Error(
"Колесо доступно раз в сутки"
);

}


}



// Получаем призы

const prizes =
await getPrizes();



if(!prizes.length){

throw new Error(
"No prizes"
);

}



// Выбираем приз

const prize =
randomPrize(prizes);




// Начисляем награду

if(
prize.type === "stars"
){


await db.query(`

UPDATE users

SET balance = balance + $1

WHERE telegram_id=$2

`,[

prize.value,

telegram_id

]);


}



// Записываем историю

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

const index = prizes.findIndex(p => p.id === prize.id);

return {
    ...prize,
    index,
    total: prizes.length
};


}



module.exports={

spin,

getPrizes

};