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
exports.getInfo = async(req,res)=>{

try{

const db =
require("../config/database");


const user =
await db.query(`

SELECT

wheel_spins,

last_spin

FROM users

WHERE telegram_id=$1

`,
[
req.params.telegram_id
]
);



res.json({

success:true,

info:user.rows[0]

});


}catch(err){

res.status(500).json({
success:false
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