const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed"),
    defaultValue: "pending",
  },
  stockDeducted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
code: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
},


});

module.exports = Order;
