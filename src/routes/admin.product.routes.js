
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const controller = require("../controllers/admin.product.controller");

// LISTAR (ADMIN)
router.get("/products", auth, isAdmin, controller.listProducts);

// GET 1 (ADMIN)
router.get("/products/:id", auth, isAdmin, controller.getProductById);

// CRUD
router.post("/products", auth, isAdmin, controller.createProduct);
router.put("/products/:id", auth, isAdmin, controller.updateProduct);
router.delete("/products/:id", auth, isAdmin, controller.deleteProduct);

// ✅ TOGGLE ACTIVO / INACTIVO
router.patch("/products/:id/toggle", auth, isAdmin, controller.toggleProductStatus);

module.exports = router;
