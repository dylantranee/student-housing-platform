const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/auth");


// POST /register
router.post("/register", authController.register);

// POST /login
router.post("/login", authController.login);

// GET /profile (protected)
router.get("/profile", authenticate, authController.profile);
// PATCH /api/auth/profile
router.patch("/profile", authenticate, authController.updateProfile);

module.exports = router;
