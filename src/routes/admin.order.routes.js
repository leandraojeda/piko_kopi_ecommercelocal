const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const {
  listOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/admin.order.controller");

// LISTAR
router.get("/orders", auth, isAdmin, listOrders);

// DETALLE
router.get("/orders/:id", auth, isAdmin, getOrderById);

// ✅ ACTUALIZAR ESTADO (PUT)
router.put("/orders/:id/status", auth, isAdmin, updateOrderStatus);

module.exports = router;
