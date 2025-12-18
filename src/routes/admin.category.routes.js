const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const controller = require("../controllers/admin.category.controller");

router.get("/categories", auth, isAdmin, controller.listCategories);
router.get("/categories/:id", auth, isAdmin, controller.getCategoryById);
router.post("/categories", auth, isAdmin, controller.createCategory);
router.put("/categories/:id", auth, isAdmin, controller.updateCategory);
router.delete("/categories/:id", auth, isAdmin, controller.deleteCategory);

module.exports = router;
