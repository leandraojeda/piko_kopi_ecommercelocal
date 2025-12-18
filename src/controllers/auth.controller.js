const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * =========================
 * REGISTER (SOLO CLIENTE)
 * =========================
 */
exports.register = async (req, res) => {
  try {
    const { name, lastname, email, password, phone, city } = req.body;

    // 🔎 Validaciones básicas
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({
        message: "Nombre, apellido, email y contraseña son obligatorios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // ❌ Evitar email duplicado
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({
        message: "El correo ya está registrado",
      });
    }

    // 🔐 Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Crear usuario (SIEMPRE customer y activo)
    await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone: phone || null,
      city: city || null,
      role: "customer",
      isActive: true,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
    });
  } catch (error) {
    console.error("❌ Error en register:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/**
 * =========================
 * LOGIN (CLIENTE / ADMIN)
 * =========================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Validaciones
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    // 🔍 Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    // 🚫 Usuario bloqueado
    if (user.isActive === false) {
      return res.status(403).json({
        message: "Usuario bloqueado por el administrador",
      });
    }

    // 🔐 Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    // 🔑 Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Respuesta (SIN password)
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
