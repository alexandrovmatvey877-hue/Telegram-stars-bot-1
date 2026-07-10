const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// Получить всех пользователей
router.get("/users", adminController.getUsers);

// Изменить баланс пользователя
router.post("/balance", adminController.updateBalance);

// Статистика
router.get("/stats", adminController.getStats);

// Ручной стоп/запуск продаж
router.post("/sales", adminController.changeSalesState);

module.exports = router;