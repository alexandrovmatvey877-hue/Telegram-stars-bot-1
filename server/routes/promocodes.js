const express = require("express");

const router = express.Router();

const promocodeController = require("../controllers/promocodeController");

router.post("/create", promocodeController.createPromo);

router.post("/use", promocodeController.usePromo);

router.get("/", promocodeController.getPromos);

router.get("/:code", promocodeController.getPromo);

module.exports = router;