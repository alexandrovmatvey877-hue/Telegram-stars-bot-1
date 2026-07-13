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