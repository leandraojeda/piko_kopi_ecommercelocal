const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("⚠️ Variables ADMIN no definidas");
    return;
  }

  const exists = await User.findOne({ where: { email: adminEmail } });

  if (exists) {
    console.log("ℹ️ Admin ya existe");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "Admin",
    lastname: "Principal",
    email: adminEmail,
    password: hashedPassword,
    role: "admin", // 🔥 ESTO ES CLAVE
  });

  console.log("✅ Admin creado correctamente");
};
