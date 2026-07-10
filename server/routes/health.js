const express = require("express");
const router = express.Router();

const monitor = require("../services/monitor");
const salesGuard = require("../services/salesGuard");


router.get("/", async (req, res) => {

    try {

        const system = monitor.getServiceStatus();
        const sales = salesGuard.getSalesInfo();

        res.json({
            success: true,
            system,
            sales,
            timestamp: new Date()
        });

    } catch (err) {

        console.error("HEALTH ERROR:", err);

        res.status(500).json({
            success: false,
            error: "Health check failed"
        });

    }

});


module.exports = router;