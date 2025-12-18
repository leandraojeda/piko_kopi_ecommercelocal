const { Order, OrderItem } = require("../models");

exports.myOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.findAll({
    where: { UserId: userId },
    include: [OrderItem],
    order: [["createdAt", "DESC"]],
  });

  res.json(orders);
};
