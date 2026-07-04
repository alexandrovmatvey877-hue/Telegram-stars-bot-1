const express = require("express");

const router = express.Router();

const balanceController = require("../controllers/balanceController");
const adminAuth = require("../middleware/adminAuth");

// Баланс пользователя
router.get("/:telegram_id", balanceController.getBalance);

// Пополнение (админ / Platega)
router.post("/deposit", adminAuth, balanceController.deposit);

// Списание
router.post("/withdraw", adminAuth, balanceController.withdraw);

// Изменить баланс вручную
router.post("/set", adminAuth, balanceController.setBalance);

module.exports = router;