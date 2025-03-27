const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin } = require("../controllers/authControllers");
const { verifyToken, isAdmin } = require("../middlewares/auth");

// Admin Signup (First-time setup only)
router.post("/signup", adminSignup);

// Admin Login
router.post("/login", adminLogin);

// Protected Admin Route Example
router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = router;
