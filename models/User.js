const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Existing Auth Fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "librarian", "user"],
      default: "user",
    }, // Added 'librarian'

    // New Library-Specific Fields
    isSuspended: { type: Boolean, default: false },
    borrowingLimit: { type: Number, default: 5 }, // Max books user can borrow
    currentLoans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
      },
    ],
    borrowingHistory: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        borrowedDate: Date,
        returnedDate: Date,
        status: { type: String, enum: ["active", "returned", "overdue"] },
      },
    ],
    notifications: [
      {
        type: {
          type: String,
          enum: ["due_alert", "available", "fine", "account"],
        },
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Password Hashing (Keep existing)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Comparison (Keep existing)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// New Method: Check if user can borrow more books
userSchema.methods.canBorrow = function () {
  return this.currentLoans.length < this.borrowingLimit && !this.isSuspended;
};

module.exports = mongoose.model("User", userSchema);
