const PDFDocument = require("pdfkit");

async function drawImage(doc, url, x, y, size = 50) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("No se pudo descargar imagen");

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    doc.image(buffer, x, y, { width: size, height: size });
  } catch (err) {
    // si falla, dibuja un cuadro placeholder
    doc.rect(x, y, size, size).stroke();
  }
}

module.exports = async function generateOrderPdf(order, items, city, res) {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=comprobante-${order.code}.pdf`
  );

  doc.pipe(res);

  // ===== HEADER =====
  doc
    .fontSize(22)
    .text("PIKO KOPI", { align: "center" })
    .fontSize(12)
    .text("Comprobante de compra", { align: "center" })
    .moveDown();

  // ===== INFO =====
  doc.fontSize(11);
  doc.text(`Código de orden: ${order.code}`);
  doc.text(`Cliente: ${order.customerName}`);
  doc.text(`Ciudad: ${city || "-"}`);
  doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  // ===== TABLE HEADER =====
  let y = doc.y;
  doc.fontSize(12).text("Detalle de productos", 40, y);
  y += 20;

  doc
    .fontSize(10)
    .text("Imagen", 40, y)
    .text("Producto", 110, y)
    .text("Cant.", 320, y)
    .text("Subtotal", 380, y);

  y += 15;
  doc.moveTo(40, y).lineTo(550, y).stroke();
  y += 10;

  // ===== PRODUCTS =====
  for (const item of items) {
    const imageUrl =
      item.Product?.ProductImages?.[0]?.imageUrl || null;

    if (imageUrl) {
      await drawImage(doc, imageUrl, 40, y - 5, 50);
    } else {
      doc.rect(40, y - 5, 50, 50).stroke();
    }

    const name = item.Product?.name || "Producto";
    const subtotal = Number(item.price) * Number(item.quantity);

    doc
      .fontSize(10)
      .text(name, 110, y, { width: 200 })
      .text(String(item.quantity), 330, y)
      .text(`Bs ${subtotal.toFixed(2)}`, 380, y);

    y += 60;

    if (y > 720) {
      doc.addPage();
      y = 40;
    }
  }

  // ===== TOTAL =====
  doc
    .fontSize(14)
    .text(`TOTAL FINAL: Bs ${Number(order.total).toFixed(2)}`, 40, y + 10, {
      align: "right",
    });

  // ===== FOOTER =====
  doc.moveDown(3);
  doc
    .fontSize(11)
    .text("Gracias por confiar en Piko Kopi :D", { align: "center" });

  doc.end();
};
