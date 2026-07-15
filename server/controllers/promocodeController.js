const db = require("../config/database");


// ===============================
// СОЗДАНИЕ ПРОМОКОДА (АДМИН)
// ===============================
exports.createPromo = async (req, res) => {

    try {

        const {
            code,
            type,
            value,
            max_uses,
            expires_at
        } = req.body;


        if (!code || !type || !value) {
            return res.status(400).json({
                success: false,
                message: "Недостаточно данных"
            });
        }


        const result = await db.query(
            `
            INSERT INTO promocodes
            (
                code,
                type,
                value,
                max_uses,
                expires_at
            )

            VALUES ($1,$2,$3,$4,$5)

            RETURNING *
            `,
            [
                code.toUpperCase(),
                type,
                value,
                max_uses || 0,
                expires_at || null
            ]
        );


        res.json({
            success: true,
            promo: result.rows[0]
        });


    } catch (err) {

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Ошибка сервера"
        });

    }

};




// ===============================
// ИСПОЛЬЗОВАНИЕ ПРОМОКОДА
// ===============================
exports.usePromo = async (req,res)=>{


    try {


        const {
            code,
            telegram_id
        } = req.body;



        if(!code || !telegram_id){

            return res.status(400).json({
                success:false,
                message:"Нет данных"
            });

        }



        // Ищем промик

        const promoResult = await db.query(

            `
            SELECT *
            FROM promocodes
            WHERE code=$1
            `,
            [
                code.toUpperCase()
            ]

        );



        if(promoResult.rows.length === 0){

            return res.json({
                success:false,
                message:"Промокод не найден"
            });

        }



        const promo = promoResult.rows[0];



        // Проверка активности

        if(!promo.is_active){

            return res.json({
                success:false,
                message:"Промокод отключен"
            });

        }




        // Проверка срока

        if(
            promo.expires_at &&
            new Date(promo.expires_at) < new Date()
        ){

            return res.json({
                success:false,
                message:"Срок промокода истек"
            });

        }





        // Проверка количества

        if(
            promo.max_uses > 0 &&
            promo.used_count >= promo.max_uses
        ){

            return res.json({
                success:false,
                message:"Лимит использований закончился"
            });

        }




        // Проверяем использовал ли человек

        const used = await db.query(

            `
            SELECT *
            FROM promo_uses
            WHERE promo_id=$1
            AND telegram_id=$2
            `,
            [
                promo.id,
                telegram_id
            ]

        );



        if(used.rows.length > 0){

            return res.json({
                success:false,
                message:"Вы уже использовали этот промокод"
            });

        }





        // Начисление

        if(promo.type === "balance"){


            await db.query(

                `
                UPDATE users
                SET balance = balance + $1
                WHERE telegram_id=$2
                `,
                [
                    promo.value,
                    telegram_id
                ]

            );


        }



        // Записываем использование

        await db.query(

            `
            INSERT INTO promo_uses
            (
                promo_id,
                telegram_id,
                reward
            )

            VALUES($1,$2,$3)
            `,
            [
                promo.id,
                telegram_id,
                promo.value
            ]

        );




        // Увеличиваем счетчик

        await db.query(

            `
            UPDATE promocodes

            SET used_count = used_count + 1

            WHERE id=$1
            `,
            [
                promo.id
            ]

        );



        res.json({

            success:true,

            message:"Промокод применен",

            reward:promo.value

        });



    } catch(err){


        console.error(err);


        res.status(500).json({

            success:false,

            message:"Ошибка сервера"

        });


    }


};





// ===============================
// ВСЕ ПРОМОКОДЫ
// ===============================
exports.getPromos = async(req,res)=>{


    try{


        const result = await db.query(

            `
            SELECT *
            FROM promocodes
            ORDER BY created_at DESC
            `

        );


        res.json({

            success:true,

            promos:result.rows

        });



    }catch(err){

        console.error(err);

        res.status(500).json({
            success:false
        });

    }


};





// ===============================
// ОДИН ПРОМОКОД
// ===============================
exports.getPromo = async(req,res)=>{


    try{


        const {
            code
        } = req.params;



        const result = await db.query(

            `
            SELECT *
            FROM promocodes
            WHERE code=$1
            `,
            [
                code.toUpperCase()
            ]

        );



        if(result.rows.length===0){

            return res.json({

                success:false,

                message:"Не найден"

            });

        }



        res.json({

            success:true,

            promo:result.rows[0]

        });



    }catch(err){

        console.error(err);

        res.status(500).json({

            success:false

        });

    }


};