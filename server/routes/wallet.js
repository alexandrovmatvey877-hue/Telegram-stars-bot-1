const express = require("express");

const router = express.Router();

const walletController = require("../controllers/walletController");

// Получить кошелек пользователя
router.get("/:telegram_id", walletController.getWallet);

// Сохранить кошелек
router.post("/", walletController.saveWallet);

// Удалить кошелек
router.delete("/:telegram_id", walletController.deleteWallet);

module.exports = router;