  const mongoose = require("mongoose");

  const loanSchema = new mongoose.Schema(
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      checkoutDate: {
        type: Date,
        default: Date.now,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      returnDate: Date,
      status: {
        type: String,
        enum: ["active", "returned", "overdue"],
        default: "active",
      },
      renewals: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

  // Add index for frequently queried fields
  loanSchema.index({ book: 1, user: 1, status: 1 });

  module.exports = mongoose.model("Loan", loanSchema);
