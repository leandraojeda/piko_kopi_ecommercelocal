const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.get("/", controller.listProducts);
router.get("/:id", controller.getProductById);

module.exports = router;
