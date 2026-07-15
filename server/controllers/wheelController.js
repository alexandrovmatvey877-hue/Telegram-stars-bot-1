const wheelService = require("../services/wheelService");


// Получить призы

exports.getPrizes = async (req,res)=>{

    try{

        const prizes =
        await wheelService.getPrizes();


        res.json({

            success:true,

            prizes

        });


    }catch(err){

        console.error(err);

        res.status(500).json({

            success:false

        });

    }

};



// Крутить колесо

exports.spin = async(req,res)=>{


    try{


        const {
            telegram_id
        } = req.body;



        if(!telegram_id){

            return res.status(400).json({

                success:false,

                message:"telegram_id required"

            });

        }



        const prize =
        await wheelService.spin(
            telegram_id
        );



        res.json({

            success:true,

            prize

        });



    }catch(err){


        console.error(err);


        res.status(500).json({

            success:false,

            message:err.message

        });


    }


};

//хуй знает чо
exports.getInfo = async (req, res) => {

    try {

        const db = require("../config/database");

        const result = await db.query(`
            SELECT
                wheel_spins,
                last_spin
            FROM users
            WHERE telegram_id=$1
        `, [req.params.telegram_id]);

        if (!result.rows.length) {
            return res.status(404).json({
                success: false
            });
        }

        const user = result.rows[0];

        const cooldown = 24 * 60 * 60 * 1000;

        const last = user.last_spin
            ? new Date(user.last_spin).getTime()
            : 0;

        const now = Date.now();

        let seconds = 0;

        if (last) {

            seconds = Math.max(
                0,
                Math.floor(
                    (cooldown - (now - last)) / 1000
                )
            );

        }

        res.json({

            success: true,

            spins: user.wheel_spins,

            cooldown: seconds,

            last_spin: user.last_spin

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

//жопа?
exports.getWheel = async(req,res)=>{

try{

const wheelService =
require("../services/wheelService");


const prizes =
await wheelService.getPrizes();


res.json({

success:true,

prizes

});


}catch(err){

console.error(err);

res.status(500).json({

success:false

});

}

};
exports.buySpin = async(req,res)=>{

try{

const db = require("../config/database");

const {
telegram_id
}=req.body;

const price = 20;

const user = await db.query(

`SELECT balance,wheel_spins
FROM users
WHERE telegram_id=$1`,

[telegram_id]

);

if(!user.rows.length){

return res.status(404).json({

success:false

});

}

if(Number(user.rows[0].balance)<price){

return res.json({

success:false,

message:"Недостаточно средств"

});

}

await db.query(

`UPDATE users

SET

balance=balance-$1,

wheel_spins=wheel_spins+1

WHERE telegram_id=$2`,

[
price,
telegram_id
]

);

res.json({

success:true

});

}catch(err){

console.error(err);

res.status(500).json({

success:false

});

}

};

// ===============================
// ИСТОРИЯ ВЫИГРЫШЕЙ ДЛЯ АДМИНКИ
// ===============================

exports.getHistory = async(req,res)=>{

try{

const db = require("../config/database");


const result = await db.query(`

SELECT

wh.*,

u.username,
u.first_name

FROM wheel_history wh

LEFT JOIN users u
ON u.telegram_id = wh.telegram_id

ORDER BY wh.created_at DESC

LIMIT 100

`);


res.json({

success:true,

history:result.rows

});


}catch(err){

console.error(err);


res.status(500).json({

success:false

});


}

};



// ===============================
// СТАТИСТИКА ПРИЗОВ
// ===============================

exports.getPrizeStats = async(req,res)=>{

try{

const db = require("../config/database");


const result = await db.query(`

SELECT

wp.id,
wp.name,
wp.type,
wp.value,
wp.chance,

COUNT(wh.id) AS wins

FROM wheel_prizes wp

LEFT JOIN wheel_history wh

ON wh.prize_id = wp.id

GROUP BY wp.id

ORDER BY wp.id

`);


res.json({

success:true,

prizes:result.rows

});


}catch(err){

console.error(err);


res.status(500).json({

success:false

});


}

};