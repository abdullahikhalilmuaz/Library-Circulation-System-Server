const User = require("../models/User");
const Book = require("../models/Book");
const Loan = require("../models/Loan");

// 1. Get User Dashboard (Borrowed Books + Pending Requests)
const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("currentLoans")
      .populate("pendingRequests.book");

    res.status(200).json({
      borrowedBooks: user.currentLoans,
      pendingRequests: user.pendingRequests,
      notifications: user.notifications.filter((n) => !n.read),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get Borrowed Books (Active Loans)
const getBorrowedBooks = async (req, res) => {
  try {
    const loans = await Loan.find({
      user: req.user._id,
      status: "active",
    }).populate("book");

    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Request a Book
const requestBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const user = await User.findById(req.user._id);
    user.pendingRequests.push({
      book: book._id,
      status: "pending",
    });

    await user.save();
    res.status(200).json({ message: "Book requested successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Cancel a Request
const cancelRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.pendingRequests = user.pendingRequests.filter(
      (request) => request._id.toString() !== req.params.requestId
    );

    await user.save();
    res.status(200).json({ message: "Request cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 5. Renew a Loan
const renewLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.loanId,
      user: req.user._id,
      status: "active",
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.renewals >= 2) {
      return res.status(400).json({ message: "Maximum renewals reached" });
    }

    // Extend due date by 14 days
    loan.dueDate = new Date(loan.dueDate.setDate(loan.dueDate.getDate() + 14));
    loan.renewals += 1;
    await loan.save();

    res.status(200).json({
      message: "Loan renewed successfully",
      newDueDate: loan.dueDate,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Export all functions
module.exports = {
  getUserDashboard,
  getBorrowedBooks,
  requestBook,
  cancelRequest,
  renewLoan,
};
