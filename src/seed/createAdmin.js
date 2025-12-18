require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const { User } = require("../models");

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const exists = await User.findOne({ where: { email } });

    if (exists) {
      console.log("ℹ️ Admin ya existe");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password.trim(), 10);

    await User.create({
      name: "Admin",
      lastname: "Principal",
      email,
      password: hashed,
      role: "ADMIN",
      isActive: true,
    });

    console.log("✅ Admin creado correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
