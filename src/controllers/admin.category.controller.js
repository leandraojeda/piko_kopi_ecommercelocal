const { Category } = require("../models");
const slugify = require("slugify");

/* ================= LISTAR ================= */
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al listar categorías" });
  }
};

/* ================= OBTENER ================= */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "No encontrada" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};

/* ================= CREAR ================= */
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nombre requerido" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Category.findOne({ where: { slug } });
    if (exists) {
      return res.status(400).json({ message: "Categoría ya existe" });
    }

    const category = await Category.create({
      name,
      slug,
      image: image || null,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

/* ================= ACTUALIZAR ================= */
exports.updateCategory = async (req, res) => {
  try {
    const { name, image, isActive } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "No encontrada" });
    }

    const slug = name
      ? slugify(name, { lower: true, strict: true })
      : category.slug;

    await category.update({
      name: name ?? category.name,
      slug,
      image: image ?? category.image,
      isActive: isActive ?? category.isActive,
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

/* ================= ELIMINAR ================= */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "No encontrada" });

    await category.destroy();
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
