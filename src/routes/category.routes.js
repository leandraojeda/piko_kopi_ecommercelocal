const router = require("express").Router();
const controller = require("../controllers/category.controller");

router.get("/", controller.listPublicCategories);

module.exports = router;
