const express = require("express");

const router = express.Router();

const promocodeController = require("../controllers/promocodeController");

router.post("/create", promocodeController.createPromo);

router.post("/use", promocodeController.usePromo);

router.get("/", promocodeController.getPromos);

router.get("/:code", promocodeController.getPromo);

router.get("/test/create", async (req, res) => {
    const db = require("../config/database");

    try {
        const result = await db.query(
            `
            INSERT INTO promocodes
            (
                code,
                type,
                value,
                max_uses
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                "DRUN",
                "balance",
                50,
                1000
            ]
        );

        res.json({
            success:true,
            promo:result.rows[0]
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            success:false,
            error:err.message
        });
    }
});

module.exports = router;