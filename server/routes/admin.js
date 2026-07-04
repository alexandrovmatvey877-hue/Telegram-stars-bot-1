const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// Получить всех пользователей
router.get("/users", adminController.getUsers);

// Изменить баланс пользователя
router.post("/balance", adminController.updateBalance);

// Статистика
router.get("/stats", adminController.getStats);

module.exports = router;