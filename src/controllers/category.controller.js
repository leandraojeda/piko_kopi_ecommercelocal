const { Category } = require("../models");

exports.listPublicCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error("❌ listPublicCategories:", error);
    res.status(500).json({ message: "Error al cargar categorías" });
  }
};
