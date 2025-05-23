const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug: Log decoded token untuk melihat struktur data
    console.log("Decoded token:", decoded);

    // Pastikan token memiliki user ID
    if (!decoded.id && !decoded.userId && !decoded.user_id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - no user ID found",
      });
    }

    // Normalisasi: pastikan req.user.id selalu ada
    req.user = {
      id: decoded.id || decoded.userId || decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      ...decoded, // spread semua data lainnya
    };

    console.log("User from token:", req.user); // Debug log

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

module.exports = { verifyToken };
