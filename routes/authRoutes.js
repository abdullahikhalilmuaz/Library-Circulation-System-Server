const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  adminSignup,
  adminLogin,
} = require("../controllers/authControllers");

// Public routes
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

module.exports = router;
