const express = require("express");

const router = express.Router();

const operationsController = require("../controllers/operationsController");
const adminAuth = require("../middleware/adminAuth");

// Все операции (админ)
router.get(
    "/",
    adminAuth,
    operationsController.getAllOperations
);

// Операции пользователя
router.get(
    "/user/:telegram_id",
    operationsController.getUserOperations
);

// Добавить операцию
router.post(
    "/",
    operationsController.createOperation
);

// Получить одну операцию
router.get(
    "/:id",
    adminAuth,
    operationsController.getOperation
);

module.exports = router;