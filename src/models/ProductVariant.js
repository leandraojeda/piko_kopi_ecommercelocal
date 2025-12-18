const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductVariant = sequelize.define("ProductVariant", {
  name: {
    type: DataTypes.STRING, // ej: Color, Tamaño
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING, // ej: Rojo, Azul, Goku
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  displayType: {
  type: DataTypes.ENUM("color", "image", "text"),
  allowNull: false,
  defaultValue: "text",
},
displayValue: {
  type: DataTypes.STRING,
  allowNull: true, // hex color o url imagen
},

});

module.exports = ProductVariant;
