const express = require("express");

const router = express.Router();

const wheelController =
require("../controllers/wheelController");



router.get(
"/prizes",
wheelController.getPrizes
);



router.post(
"/spin",
wheelController.spin
);

router.get(
"/info/:telegram_id",
wheelController.getInfo
);

module.exports = router;