const { Product, ProductImage, ProductVariant, Category } = require("../models");
const { Op } = require("sequelize");

exports.listProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    const where = { isActive: true };

    // 🔍 BUSCADOR
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // 📦 INCLUDE
    const include = [
      { model: ProductImage },
      { model: ProductVariant },
      {
        model: Category,
        through: { attributes: [] },
        required: false,
      },
    ];

    // 🗂️ FILTRO POR CATEGORÍA
    if (category) {
      include[2].where = { id: category };
      include[2].required = true;
    }

    // ⬇️ ORDEN
    let order = [["createdAt", "DESC"]];

    if (sort === "price_asc") {
      order = [["basePrice", "ASC"]];
    }
    if (sort === "price_desc") {
      order = [["basePrice", "DESC"]];
    }
    if (sort === "name_asc") {
      order = [["name", "ASC"]];
    }
    if (sort === "name_desc") {
      order = [["name", "DESC"]];
    }

    const products = await Product.findAll({
      where,
      include,
      order,
    });

    res.json(products);
  } catch (error) {
    console.error("❌ listProducts:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, isActive: true },
      include: [
        ProductImage,
        ProductVariant,
        Category, // 👈 AQUÍ TAMBIÉN
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ getProductById:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};
