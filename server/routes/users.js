const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");


// Регистрация
router.post("/register", usersController.register);


// Админка
router.get("/", usersController.getAllUsers);


// Рефералы
router.get(
    "/:telegram_id/referrals",
    usersController.getReferrals
);


// Статистика
router.get(
    "/:telegram_id/stats",
    usersController.getStats
);


// Профиль
router.get(
    "/:telegram_id",
    usersController.getProfile
);


// Обновление
router.put(
    "/:telegram_id",
    usersController.updateProfile
);


module.exports = router;