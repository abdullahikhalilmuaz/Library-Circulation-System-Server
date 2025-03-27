const jwt = require("jsonwebtoken");

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // Attach user data to request
    next();
  });
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


// Check if user is a regular user (not admin/librarian)
exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "User access required" });
  }
  next();
};