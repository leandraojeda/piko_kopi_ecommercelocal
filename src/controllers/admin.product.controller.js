const {
  Product,
  ProductImage,
  ProductVariant,
  Category,
} = require("../models");

const sequelize = require("../config/database");


/* =====================================================
   CREAR PRODUCTO (ADMIN)
===================================================== */
exports.createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      description,
      basePrice,
      stock,
      hasVariants,
      images = [],
      variants = [],
      categoryIds = [],

      // 🔥 NUEVOS FLAGS
      isOffer = false,
      isNew = false,
      isPack = false,
      oldPrice = null,
    } = req.body;

    if (!name || basePrice == null) {
      return res.status(400).json({
        message: "Nombre y precio son obligatorios",
      });
    }

    if (hasVariants && variants.length === 0) {
      return res.status(400).json({
        message: "Debe enviar variantes",
      });
    }

    if (!hasVariants && stock == null) {
      return res.status(400).json({
        message: "Debe enviar stock si no hay variantes",
      });
    }

    // ✅ CREAR PRODUCTO
    const product = await Product.create(
      {
        name,
        description,
        basePrice,
        oldPrice,
        isOffer,
        isNew,
        isPack,
        hasVariants,
        stock: hasVariants ? null : stock,
      },
      { transaction: t }
    );

    // ✅ CATEGORÍAS (M:N)
    if (categoryIds.length > 0) {
      await product.setCategories(categoryIds, { transaction: t });
    }

    // ✅ IMÁGENES
    for (const url of images) {
      await ProductImage.create(
        {
          imageUrl: url,
          ProductId: product.id,
        },
        { transaction: t }
      );
    }

    // ✅ VARIANTES
    if (hasVariants) {
      for (const v of variants) {
        await ProductVariant.create(
          {
            name: v.name,
            value: v.value,
            price: v.price,
            stock: v.stock,
            ProductId: product.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return res.status(201).json({
      message: "Producto creado",
      data: { productId: product.id },
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ createProduct:", error);
    return res.status(500).json({
      message: "Error al crear producto",
    });
  }
};

/* =====================================================
   ACTUALIZAR PRODUCTO (ADMIN)
===================================================== */
exports.updateProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const {
      name,
      description,
      basePrice,
      stock,
      hasVariants,
      images = [],
      variants = [],
      categoryIds,

      // 🔥 FLAGS
      isActive,
      isOffer,
      isNew,
      isPack,
      oldPrice,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    await product.update(
      {
        name,
        description,
        basePrice,
        oldPrice: oldPrice ?? product.oldPrice,
        hasVariants,
        stock: hasVariants ? null : stock,
        isActive: isActive ?? product.isActive,
        isOffer: isOffer ?? product.isOffer,
        isNew: isNew ?? product.isNew,
        isPack: isPack ?? product.isPack,
      },
      { transaction: t }
    );

    // ✅ CATEGORÍAS
    if (Array.isArray(categoryIds)) {
      await product.setCategories(categoryIds, { transaction: t });
    }

    // ✅ IMÁGENES
    await ProductImage.destroy({
      where: { ProductId: id },
      transaction: t,
    });

    for (const url of images) {
      await ProductImage.create(
        {
          imageUrl: url,
          ProductId: id,
        },
        { transaction: t }
      );
    }

    // ✅ VARIANTES
    await ProductVariant.destroy({
      where: { ProductId: id },
      transaction: t,
    });

    if (hasVariants) {
      for (const v of variants) {
        await ProductVariant.create(
          {
            name: v.name,
            value: v.value,
            price: v.price,
            stock: v.stock,
            ProductId: id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return res.json({
      message: "Producto actualizado",
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ updateProduct:", error);
    return res.status(500).json({
      message: "Error al actualizar producto",
    });
  }
};

/* =====================================================
   DESACTIVAR PRODUCTO (ADMIN)
===================================================== */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    await product.update({ isActive: false });

    return res.json({
      message: "Producto desactivado",
    });
  } catch (error) {
    console.error("❌ deleteProduct:", error);
    return res.status(500).json({
      message: "Error al desactivar producto",
    });
  }
};
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        ProductImage,
        ProductVariant,
        Category,
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(products);
  } catch (error) {
    console.error("❌ listProducts:", error);
    return res.status(500).json({ message: "Error al listar productos" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        ProductImage,
        ProductVariant,
        Category,
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    console.error("❌ getProductById:", error);
    return res
      .status(500)
      .json({ message: "Error al cargar producto" });
  }
};

/* =====================================================
   CAMBIAR ESTADO PRODUCTO (ADMIN)
===================================================== */
/* =====================================================
   ACTIVAR / DESACTIVAR PRODUCTO (ADMIN)
===================================================== */
exports.toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await product.update({ isActive: !product.isActive });

    return res.json({
      message: product.isActive ? "Producto activado" : "Producto ocultado",
      id: product.id,
      isActive: product.isActive,
    });
  } catch (error) {
    console.error("❌ toggleProductStatus:", error);
    return res.status(500).json({ message: "Error al cambiar estado" });
  }
};

