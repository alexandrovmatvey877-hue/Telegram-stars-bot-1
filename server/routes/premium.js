const express = require("express");
const router = express.Router();

const db = require("../config/database");

const MARKUP = 1.10;

router.get("/", async (req, res) => {

    try {

        // Получаем курс TON из БД
        const settings = await db.query(
            "SELECT ton_rate FROM settings WHERE id=1"
        );

        const tonRate = Number(settings.rows[0].ton_rate);

        // Получаем цены Premium с Fragment
        const response = await fetch(
            "https://fragment-api.ydns.eu:8443/api/v1/prices"
        );

        const data = await response.json();

        const premium = data.premium;

        res.json({

            success: true,

            prices: {

                3: Math.ceil(
                    Number(premium["3_months"].price_with_commission_kyc)
                    * tonRate
                    * MARKUP
                ),

                6: Math.ceil(
                    Number(premium["6_months"].price_with_commission_kyc)
                    * tonRate
                    * MARKUP
                ),

                12: Math.ceil(
                    Number(premium["12_months"].price_with_commission_kyc)
                    * tonRate
                    * MARKUP
                )

            }

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;