const express = require("express");

const router = express.Router();

const wheelController =
require("../controllers/wheelController");


// ======================
// ПОЛУЧИТЬ ПРИЗЫ
// ======================

router.get(
"/prizes",
wheelController.getPrizes
);


// ======================
// КРУТИТЬ РУЛЕТКУ
// ======================

router.post(
"/spin",
wheelController.spin
);


// ======================
// ИНФОРМАЦИЯ ПОЛЬЗОВАТЕЛЯ
// ======================

router.get(
"/info/:telegram_id",
wheelController.getInfo
);


// ======================
// ВСЯ РУЛЕТКА
// ======================

router.get(
"/",
wheelController.getWheel
);


// ======================
// КУПИТЬ ПОПЫТКУ
// ======================

router.post(
"/buy",
wheelController.buySpin
);


// ======================
// АДМИНКА
// ======================


// История выигрышей

router.get(
"/admin/history",
wheelController.getHistory
);


// Статистика призов

router.get(
"/admin/stats",
wheelController.getPrizeStats
);


module.exports = router;