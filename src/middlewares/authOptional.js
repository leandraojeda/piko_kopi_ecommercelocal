const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 👤 Invitado (sin token)
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
