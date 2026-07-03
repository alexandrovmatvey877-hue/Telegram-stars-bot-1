const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

// Регистрация / авторизация пользователя
router.post("/register", usersController.register);

// Получить профиль
router.get("/:telegram_id", usersController.getProfile);

// Обновить пользователя
router.put("/:telegram_id", usersController.updateProfile);

// Статистика пользователя
router.get("/:telegram_id/stats", usersController.getStats);

module.exports = router;