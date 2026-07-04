const express = require("express");

const router = express.Router();

const settingsController = require("../controllers/settingsController");
const adminAuth = require("../middleware/adminAuth");

// Получить настройки
router.get("/", settingsController.getSettings);

// Сохранить настройки
router.post(
    "/",
    adminAuth,
    settingsController.saveSettings
);

// Получить цены
router.get(
    "/prices",
    settingsController.getPrices
);

// Обновить цены
router.post(
    "/prices",
    adminAuth,
    settingsController.savePrices
);

// Получить системные настройки
router.get(
    "/system",
    settingsController.getSystem
);

// Обновить системные настройки
router.post(
    "/system",
    adminAuth,
    settingsController.saveSystem
);

module.exports = router;