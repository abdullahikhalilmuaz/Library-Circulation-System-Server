const Book = require("../models/Book");

// @desc    Add new book (Admin only)
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all books (Public)
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Search books (Public)
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: query },
      ],
    });
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
