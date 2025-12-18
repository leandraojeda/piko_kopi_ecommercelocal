const express = require("express");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite local
      "http://localhost:3000",
      process.env.FRONTEND_URL, // Render frontend
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

/* ================= HEALTH CHECK (RENDER) ================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ================= PUBLIC ROUTES ================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/me", require("./routes/me.routes"));

/* ================= ADMIN ROUTES ================= */
console.log("🔌 Cargando rutas ADMIN...");
app.use("/api/admin", require("./routes/admin.product.routes"));
app.use("/api/admin", require("./routes/admin.category.routes"));
app.use("/api/admin", require("./routes/admin.order.routes"));
app.use("/api/admin", require("./routes/admin.user.routes"));

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("API Ecommerce funcionando 🚀");
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

module.exports = app;
