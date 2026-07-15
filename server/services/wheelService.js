const db = require("../config/database");


// ======================
// Получение призов
// ======================

async function getPrizes(){

    const result = await db.query(`
        SELECT *
        FROM wheel_prizes
        WHERE enabled = true
        ORDER BY id
    `);

    return result.rows;

}


// ======================
// Случайный приз
// ======================

function randomPrize(prizes){

    let total = 0;

    for(const prize of prizes){
        total += Number(prize.chance);
    }


    let random = Math.random() * total;


    for(const prize of prizes){

        random -= Number(prize.chance);

        if(random <= 0){
            return prize;
        }

    }


    return prizes[0];

}


// ======================
// Прокрутка
// ======================

async function spin(telegram_id){


    const userResult = await db.query(`
        SELECT
            balance,
            wheel_spins,
            last_spin
        FROM users
        WHERE telegram_id=$1
    `,[
        telegram_id
    ]);


    if(!userResult.rows.length){

        throw new Error(
            "User not found"
        );

    }


    const user = userResult.rows[0];


    const now = Date.now();


    const lastSpinTime = user.last_spin
        ? new Date(user.last_spin).getTime()
        : 0;


    const cooldown = 
        24 * 60 * 60 * 1000;


    const freeSpinAvailable =
        now - lastSpinTime >= cooldown;



    // ======================
    // Проверяем спин
    // ======================


    if(freeSpinAvailable){


        await db.query(`
            UPDATE users
            SET last_spin = NOW()
            WHERE telegram_id=$1
        `,[
            telegram_id
        ]);


    } else {


        const spins =
            Number(user.wheel_spins || 0);


        if(spins <= 0){

            throw new Error(
                "Нет доступных спинов"
            );

        }


        await db.query(`
            UPDATE users
            SET wheel_spins = wheel_spins - 1
            WHERE telegram_id=$1
        `,[
            telegram_id
        ]);

    }



    // ======================
    // Выбор приза
    // ======================


    const prizes =
        await getPrizes();



    if(!prizes.length){

        throw new Error(
            "No prizes configured"
        );

    }



    const prize =
        randomPrize(prizes);



    // ======================
    // Начисление
    // ======================


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



    // ======================
    // История
    // ======================


    await db.query(`
INSERT INTO wheel_history(
    telegram_id,
    prize_id,
    prize_name,
    prize_value
)

VALUES(
    $1,
    $2,
    $3,
    $4
)
`,
[
    telegram_id,
    prize.id,
    prize.name,
    prize.value
]);



    const index =
        prizes.findIndex(
            p => p.id === prize.id
        );



    return {

        ...prize,

        index,

        total: prizes.length

    };


}



module.exports = {

    spin,

    getPrizes

};