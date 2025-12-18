module.exports = function generateOrderCode() {
  return `PK-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;
};
