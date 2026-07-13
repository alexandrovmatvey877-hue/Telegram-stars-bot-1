const express = require("express");

console.log("✅ ADMIN ROUTE LOADED");

const router = express.Router();

const adminGuard = require("../middleware/security/adminGuard");

const adminController = require("../controllers/adminController");

router.use(adminGuard);

// Получить всех пользователей
router.get("/users", adminController.getUsers);

// Изменить баланс пользователя
router.post("/balance", adminController.updateBalance);

// Статистика
router.get("/stats", adminController.getStats);

// Ручной стоп/запуск продаж
router.post("/sales", adminController.changeSalesState);

// Статус системы
router.get("/system", adminController.getSystemStatus);

//рулетка гет
router.get(
"/wheel/prizes",
adminController.getWheelPrizes
);

//рулетка пост
router.post(
"/wheel/prizes",
adminController.addWheelPrize
);

//удаленре рулетки
router.delete(
"/wheel/prizes/:id",
adminController.deleteWheelPrize
);

module.exports = router;