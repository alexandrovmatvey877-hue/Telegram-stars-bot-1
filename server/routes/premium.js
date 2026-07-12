const express = require("express");
const router = express.Router();

const monitor = require("../services/monitor");

router.get("/", async (req, res) => {

    try {

        const prices = await monitor.getPremiumPrices();

        res.json({
            success: true,
            prices
        });


    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false
        });

    }

});


module.exports = router;