const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// DEBUG TEMPORAL (muy importante)
console.log("authController:", authController);

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
