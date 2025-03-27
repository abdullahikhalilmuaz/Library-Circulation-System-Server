const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/auth");
const {
  addBook,
  getBooks,
  searchBooks,
} = require("../controllers/bookController");

// Public routes
router.get("/", getBooks);
router.get("/search", searchBooks);

// Admin-only routes
router.post("/", verifyToken, isAdmin, addBook);

module.exports = router;
