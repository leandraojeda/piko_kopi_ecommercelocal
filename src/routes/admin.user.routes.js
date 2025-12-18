const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

// ===============================
// GET /api/admin/users
// ===============================
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "lastname",
        "email",
        "phone",
        "city",
        "role",
        "isActive",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("Error listando usuarios:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
});

// ===============================
// PATCH /api/admin/users/:id/block
// ===============================
router.patch("/users/:id/block", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ message: "Estado actualizado" });
  } catch (error) {
    console.error("Error bloqueando usuario:", error);
    res.status(500).json({ message: "Error al cambiar estado" });
  }
});

// ===============================
// PATCH /api/admin/users/:id/role
// ===============================
router.patch("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Rol actualizado" });
  } catch (error) {
    console.error("Error cambiando rol:", error);
    res.status(500).json({ message: "Error al cambiar rol" });
  }
});

module.exports = router;
