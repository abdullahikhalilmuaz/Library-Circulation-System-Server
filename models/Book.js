const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, enum: ["Fiction", "Non-Fiction", "Academic", "Other"] },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  shelfLocation: String,
  publishedYear: Number,
  coverImage: String
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);