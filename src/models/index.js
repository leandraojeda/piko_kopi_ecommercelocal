const User = require("./User");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Product = require("./Product");
const ProductImage = require("./ProductImage");
const ProductVariant = require("./ProductVariant");
const Category = require("./Category");
const ProductCategory = require("./ProductCategory");

/* ======================================================
   USER ↔ ORDER
====================================================== */
User.hasMany(Order, {
  foreignKey: "UserId",
  onDelete: "SET NULL",
});
Order.belongsTo(User, {
  foreignKey: "UserId",
});

/* ======================================================
   ORDER ↔ ORDER ITEM
====================================================== */
Order.hasMany(OrderItem, {
  as: "items",
  foreignKey: "OrderId",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "OrderId",
});

/* ======================================================
   PRODUCT ↔ ORDER ITEM
====================================================== */
Product.hasMany(OrderItem, {
  foreignKey: "ProductId",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Product, {
  foreignKey: "ProductId",
});

/* ======================================================
   PRODUCT VARIANT ↔ ORDER ITEM
====================================================== */
ProductVariant.hasMany(OrderItem, {
  foreignKey: "ProductVariantId",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(ProductVariant, {
  foreignKey: "ProductVariantId",
});

/* ======================================================
   PRODUCT ↔ PRODUCT IMAGE
====================================================== */
Product.hasMany(ProductImage, {
  foreignKey: "ProductId",
  onDelete: "CASCADE",
});
ProductImage.belongsTo(Product, {
  foreignKey: "ProductId",
});

/* ======================================================
   PRODUCT ↔ PRODUCT VARIANT
====================================================== */
Product.hasMany(ProductVariant, {
  foreignKey: "ProductId",
  onDelete: "CASCADE",
});
ProductVariant.belongsTo(Product, {
  foreignKey: "ProductId",
});

/* ======================================================
   PRODUCT ↔ CATEGORY (MANY TO MANY)
====================================================== */
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "ProductId",
  otherKey: "CategoryId",
});

Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "CategoryId",
  otherKey: "ProductId",
});

/* ======================================================
   EXPORT MODELS
====================================================== */
module.exports = {
  User,
  Order,
  OrderItem,
  Product,
  ProductImage,
  ProductVariant,
  Category,
  ProductCategory,
};
