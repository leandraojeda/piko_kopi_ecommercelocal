const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const meController = require("../controllers/me.controller");

router.get("/orders", auth, meController.myOrders);

module.exports = router;
