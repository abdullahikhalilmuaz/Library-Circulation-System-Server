const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper Functions
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const handleError = (res, err, status = 500) => {
  res.status(status).json({
    success: false,
    message: err.message,
  });
};

// User Signup
exports.userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create user (default role: 'user')
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    handleError(res, err, 401);
  }
};

// Admin Signup (One-time)
exports.adminSignup = async (req, res) => {
  try {
    if (await User.exists({ role: "admin" })) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await User.create({
      ...req.body,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      token: generateToken(admin._id, admin.role),
      role: admin.role,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const admin = await User.findOne({
      email: req.body.email,
      role: "admin",
    });

    if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
      throw new Error("Invalid admin credentials");
    }

    res.json({
      success: true,
      token: generateToken(admin._id, admin.role),
      role: admin.role,
    });
  } catch (err) {
    handleError(res, err, 401);
  }
};
