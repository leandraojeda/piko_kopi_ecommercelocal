const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/my", authMiddleware, orderController.getMyOrders);
router.get("/:id", authMiddleware, orderController.getOrderById);

module.exports = router;
