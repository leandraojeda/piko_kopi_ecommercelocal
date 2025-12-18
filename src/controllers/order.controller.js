const {
  Order,
  OrderItem,
  Product,
  ProductVariant,
} = require("../models");

const sendWhatsapp = require("../utils/sendWhatsapp");
const generateOrderPdf = require("../utils/orderPdf");
const generateOrderCode = require("../utils/orderCode");

/* ================= CREAR ORDEN ================= */
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      address,
      items,
    } = req.body;

    if (!customerName || !phone || !items || items.length === 0) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const orderCode = generateOrderCode();
    let total = 0;

    // 🔐 la orden pertenece al usuario logueado
    const order = await Order.create({
      code: orderCode,
      customerName,
      customerEmail: customerEmail || null,
      phone,
      address,
      status: "pending",
      total: 0,
      UserId: req.user.id, // 👈 CLAVE
    });

    for (const item of items) {
      let price;

      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId);
        if (!variant) return res.status(400).json({ message: "Variante inválida" });
        price = Number(variant.price);
      } else {
        const product = await Product.findByPk(item.productId);
        if (!product) return res.status(400).json({ message: "Producto inválido" });
        price = Number(product.basePrice);
      }

      total += price * item.quantity;

      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.productId,
        ProductVariantId: item.variantId || null,
        quantity: item.quantity,
        price,
      });
    }

    await order.update({ total });

    const fullItems = await OrderItem.findAll({
      where: { OrderId: order.id },
      include: [
        { model: Product, attributes: ["id", "name"] },
        { model: ProductVariant, attributes: ["id", "name", "value"] },
      ],
    });

    await sendWhatsapp(order, fullItems, total);
    res.setHeader("X-Order-Code", order.code);

    return await generateOrderPdf(order, fullItems, address, res);
  } catch (error) {
    console.error("❌ createOrder:", error);
    return res.status(500).json({ message: "Error al crear la orden" });
  }
};

/* ================= HISTORIAL DEL CLIENTE ================= */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id }, // 🔐 SOLO SUS ÓRDENES
      order: [["createdAt", "DESC"]],
    });

    return res.json(orders);
  } catch (error) {
    console.error("❌ getMyOrders:", error);
    return res.status(500).json({ message: "Error al obtener órdenes" });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Buscar la orden (solo del usuario)
    const order = await Order.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    // 2️⃣ Buscar items de la orden
    const items = await OrderItem.findAll({
      where: { OrderId: order.id },
      include: [
        { model: Product },
        { model: ProductVariant },
      ],
    });

    // 3️⃣ Respuesta normalizada
    return res.json({
      ...order.toJSON(),
      items, // 👈 EXACTAMENTE lo que el frontend espera
    });

  } catch (error) {
    console.error("❌ getOrderById ERROR REAL:", error);
    return res.status(500).json({
      message: "Error interno al cargar detalle",
    });
  }
};
