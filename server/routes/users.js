const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");


// =======================
// РЕГИСТРАЦИЯ
// =======================

router.post(
    "/register",
    usersController.register
);


// =======================
// АДМИНКА - ВСЕ ПОЛЬЗОВАТЕЛИ
// =======================

router.get(
    "/",
    usersController.getAllUsers
);


// =======================
// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
// =======================

router.get(
    "/:telegram_id",
    usersController.getProfile
);


// =======================
// ОБНОВЛЕНИЕ ПРОФИЛЯ
// =======================

router.put(
    "/:telegram_id",
    usersController.updateProfile
);


// =======================
// СТАТИСТИКА
// =======================

router.get(
    "/:telegram_id/stats",
    usersController.getStats
);


// =======================
// РЕФЕРАЛЫ ПОЛЬЗОВАТЕЛЯ
// =======================

router.get(
    "/:telegram_id/referrals",
    usersController.getReferrals
);


module.exports = router;