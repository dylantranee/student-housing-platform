const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../../../common/middleware/auth");

// POST /register
router.post("/register", authController.register);

// POST /login
router.post("/login", authController.login);

// GET /profile (protected)
router.get("/profile", authenticate, authController.profile);

// PATCH /profile (protected)
router.patch("/profile", authenticate, authController.updateProfile);

module.exports = router;
