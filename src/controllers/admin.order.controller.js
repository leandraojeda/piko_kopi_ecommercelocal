const { Order, OrderItem, Product, ProductVariant, User } = require("../models");

/* ======================================================
   LISTAR PEDIDOS (ADMIN)
====================================================== */
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User },
        {
          model: OrderItem,
          as: "items",
          include: [Product, ProductVariant],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("❌ listOrders:", error);
    res.status(500).json({ message: "Error al listar pedidos" });
  }
};

/* ======================================================
   OBTENER PEDIDO POR ID
====================================================== */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: User },
        {
          model: OrderItem,
          as: "items",
          include: [Product, ProductVariant],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ getOrderById:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};

/* ======================================================
   ACTUALIZAR ESTADO DEL PEDIDO
====================================================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Estado requerido",
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    await order.update({ status });

    res.json({
      message: "Estado del pedido actualizado",
    });
  } catch (error) {
    console.error("❌ updateOrderStatus:", error);
    res.status(500).json({
      message: "Error al actualizar estado",
    });
  }
};
