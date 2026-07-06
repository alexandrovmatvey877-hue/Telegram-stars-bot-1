const db = require("../config/database");

// =====================================
// Получить ВСЕ настройки
// =====================================

exports.getSettings = async (req, res) => {

    try {

        const result = await db.query(
    "SELECT * FROM settings WHERE id = 1"
);

console.log("SETTINGS =", result.rows);

res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Ошибка получения настроек"
        });

    }

};

// =====================================
// Сохранить ВСЕ настройки
// =====================================

exports.saveSettings = async (req, res) => {

    try {

        const s = req.body;

        await db.query(`
            UPDATE settings SET

            stars50=$1,
            stars75=$2,
            stars100=$3,
            stars150=$4,
            stars250=$5,
            stars500=$6,
            stars1000=$7,

            ton_wallet=$8,
            ton_rate=$9,
            stars_rate=$10,

            mode=$11,

            sales_enabled=$12,
            deposits_enabled=$13,
            referrals_enabled=$14,
            balance_payment_enabled=$15,


            WHERE id=1
        `, [

            s.stars50,
            s.stars75,
            s.stars100,
            s.stars150,
            s.stars250,
            s.stars500,
            s.stars1000,

            s.ton_wallet,
            s.ton_rate,
            s.stars_rate,

            s.mode,

            s.sales_enabled,
            s.deposits_enabled,
            s.referrals_enabled,
            s.balance_payment_enabled,


        ]);

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Ошибка сохранения"
        });

    }

};

// =====================================
// Только цены
// =====================================

exports.getPrices = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT

            stars50,
            stars75,
            stars100,
            stars150,
            stars250,
            stars500,
            stars1000

            FROM settings

            WHERE id=1
        `);

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success:false
        });

    }

};

// =====================================
// Сохранить цены
// =====================================

exports.savePrices = async (req,res)=>{

    try{

        const s=req.body;

        await db.query(`

        UPDATE settings

        SET

        stars50=$1,
        stars75=$2,
        stars100=$3,
        stars150=$4,
        stars250=$5,
        stars500=$6,
        stars1000=$7

        WHERE id=1

        `,[

            s.stars50,
            s.stars75,
            s.stars100,
            s.stars150,
            s.stars250,
            s.stars500,
            s.stars1000

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

// =====================================
// Система
// =====================================

exports.getSystem = async(req,res)=>{

    try{

        const result=await db.query(`

        SELECT

        ton_wallet,
        ton_rate,
        stars_rate,
        mode,

        sales_enabled,
        deposits_enabled,
        referrals_enabled,
        balance_payment_enabled

        FROM settings

        WHERE id=1

        `);

        res.json(result.rows[0]);

    }catch(err){

        console.error(err);

        res.status(500).json({
            success:false
        });

    }

};

exports.saveSystem=async(req,res)=>{

    try{

        const s=req.body;

        await db.query(`

        UPDATE settings

        SET

        ton_wallet=$1,
        ton_rate=$2,
        stars_rate=$3,
        mode=$4,

        sales_enabled=$5,
        deposits_enabled=$6,
        referrals_enabled=$7,
        balance_payment_enabled=$8,

        updated_at=$9

        WHERE id=1

        `,[

            s.ton_wallet,
            s.ton_rate,
            s.stars_rate,
            s.mode,

            s.sales_enabled,
            s.deposits_enabled,
            s.referrals_enabled,
            s.balance_payment_enabled,

            Date.now()

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