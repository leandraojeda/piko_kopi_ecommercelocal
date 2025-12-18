const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true, // solo si NO hay variantes
  },
  hasVariants: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isOffer: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
isNew: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
isPack: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
oldPrice: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: true,
},
});

module.exports = Product;
