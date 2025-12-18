module.exports = async (order, items, total) => {
  let msg = `🛒 *NUEVO PEDIDO*\n\n`;
  msg += `👤 Cliente: ${order.customerName}\n`;
  msg += `📞 Teléfono: ${order.phone}\n`;
  msg += order.address ? `📍 Dirección: ${order.address}\n` : "";
  msg += `🆔 Orden: #${order.id}\n\n`;
  msg += `📦 *Productos:*\n`;

  items.forEach((i) => {
    msg += `• Producto ID ${i.productId}`;
    if (i.variantId) msg += ` (Variante ${i.variantId})`;
    msg += ` x${i.quantity}\n`;
  });

  msg += `\n💰 Total: Bs ${total}`;

  console.log("📲 WHATSAPP MESSAGE:\n", msg);

  // 👉 Aquí luego conectas WhatsApp Business API
};
