const db = require("../config/database");
const salesGuard = require("../services/salesGuard");
const passwordGuard = require("../services/passwordGuard");
const securityLogger = require("../services/securityLogger");

// =========================
// Все пользователи
// =========================

exports.getUsers = async (req, res) => {

    try {
console.log("🔥 BEFORE DB");
        const result = await db.query(`
            SELECT 
    u.*,
    r.username AS referrer_username,
    r.first_name AS referrer_name
FROM users u
LEFT JOIN users r
ON u.referrer_id = r.telegram_id
ORDER BY u.registered_at DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};

// =========================
// Изменение баланса
// =========================

exports.updateBalance = async (req, res) => {

    const client = await db.connect();

    try {

        const { telegram_id, action, amount } = req.body;

        const value = Number(amount);


        if (!Number.isFinite(value) || value <= 0) {

            return res.status(400).json({
                success:false,
                message:"Invalid amount"
            });

        }


        await client.query("BEGIN");


        const result = await client.query(
            `
            SELECT balance
            FROM users
            WHERE telegram_id=$1
            FOR UPDATE
            `,
            [telegram_id]
        );


        if (!result.rows.length) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        }


        let balance = Number(result.rows[0].balance);



        switch(action){


            case "add":

                balance += value;

                break;



            case "subtract":

                balance -= value;

                break;



            case "set":

                balance = value;

                break;



            default:

                await client.query("ROLLBACK");

                return res.status(400).json({
                    success:false,
                    message:"Invalid action"
                });

        }



        if(balance < 0){

            await client.query("ROLLBACK");

            return res.status(400).json({
                success:false,
                message:"Balance cannot be negative"
            });

        }



        await client.query(
            `
            UPDATE users
            SET balance=$1
            WHERE telegram_id=$2
            `,
            [
                balance,
                telegram_id
            ]
        );



        await client.query("COMMIT");



        await securityLogger.log(
            "ADMIN_BALANCE_CHANGE",
            {
                telegram_id,
                action,
                amount:value,
                new_balance:balance
            }
        );



        res.json({

            success:true,

            balance

        });



    } catch(err){


        await client.query("ROLLBACK");


        console.error(err);


        res.status(500).json({
            success:false
        });



    } finally {


        client.release();


    }

};

// =========================
// Статистика
// =========================

exports.getStats = async (req, res) => {

    try {

        const result = await db.query(`

            SELECT

                COUNT(*) AS users,

                COALESCE(SUM(balance),0) AS balance,

                COALESCE(SUM(total_deposit),0) AS deposits,

                COALESCE(SUM(total_spent),0) AS spent

            FROM users

        `);

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
exports.changeSalesState = async (req, res) => {

    try {

        const { action, password } = req.body;

        if (action === "stop") {

            if (!passwordGuard.checkStopPassword(password)) {

                return res.status(403).json({
                    success: false,
                    message: "Неверный пароль"
                });

            }

            await salesGuard.stopSales("Manual stop", "manual");

            return res.json({
                success: true,
                status: "STOPPED"
            });

        }

        if (action === "start") {

            if (!passwordGuard.checkStartPassword(password)) {

                return res.status(403).json({
                    success: false,
                    message: "Неверный пароль"
                });

            }

            await salesGuard.startSales();

            return res.json({
                success: true,
                status: "STARTED"
            });

        }

        return res.status(400).json({
            success: false,
            message: "Unknown action"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
exports.getSystemStatus = async (req, res) => {

    try {

        const status = require("../services/monitor")
            .getServiceStatus();

        const sales = require("../services/salesGuard")
            .getSalesInfo();

        res.json({
            success: true,
            system: status,
            sales
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

};
// =======================
// WHEEL ADMIN
// =======================

console.log("🔥 ADMIN WHEEL PRIZES START");
exports.getWheelPrizes = async (req,res)=>{

    try{

        const db = require("../config/database");

        const result = await db.query(`

        SELECT *

        FROM wheel_prizes

        ORDER BY id

        `);
console.log("🔥 AFTER DB");


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



exports.addWheelPrize = async(req,res)=>{

    try{

        const db = require("../config/database");


        const {
            name,
            type,
            value,
            chance
        } = req.body;



        await db.query(`

        INSERT INTO wheel_prizes
        (
        name,
        type,
        value,
        chance
        )

        VALUES($1,$2,$3,$4)

        `,[

        name,
        type,
        value,
        chance

        ]);



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



exports.deleteWheelPrize = async(req,res)=>{

    try{

        const db = require("../config/database");


        await db.query(

        `
        DELETE FROM wheel_prizes
        WHERE id=$1
        `,

        [
            req.params.id
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