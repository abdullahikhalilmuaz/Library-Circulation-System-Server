require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken, isAdmin } = require("./middlewares/auth"); // Fix path

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes (NO DUPLICATES)
app.use("/api/auth", require("./routes/authRoutes")); // All auth routes
app.use("/api/admin", verifyToken, isAdmin, require("./routes/adminRoutes")); // Protected admin routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/user", verifyToken, require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
