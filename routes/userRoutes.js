const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  getUserDashboard,
  getBorrowedBooks,
  requestBook,
  cancelRequest,
  renewLoan,
} = require("../controllers/userController");

// User Dashboard
router.get("/dashboard", verifyToken, getUserDashboard);

// Borrowed Books
router.get("/borrowed", verifyToken, getBorrowedBooks);

// Book Requests
router.post("/request/:bookId", verifyToken, requestBook);
router.delete("/request/:requestId", verifyToken, cancelRequest);

// Loan Renewal
router.post("/renew/:loanId", verifyToken, renewLoan);

module.exports = router;
