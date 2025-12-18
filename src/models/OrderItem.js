const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  // 🔑 FK (Sequelize las necesita)
  OrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProductVariantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = OrderItem;
