const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No authorization header provided",
    });
  }

  // Extract token dari "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bearer token malformed",
    });
  }

  try {
    // Verify token dengan algoritma yang sama seperti Flask
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Debug: Log decoded token untuk troubleshooting
    console.log("Decoded token:", decoded);

    // Pastikan token memiliki userId (sesuai dengan Flask)
    if (!decoded.userId && !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token structure - no user ID found",
      });
    }

    // Set req.user dengan struktur yang konsisten
    req.user = {
      id: decoded.userId || decoded.id, // prioritas userId untuk konsistensi dengan Flask
      userId: decoded.userId || decoded.id, // backup field
      email: decoded.email,
      name: decoded.name,
      // spread semua data lainnya jika ada
      ...decoded,
    };

    console.log("User from token:", req.user); // Debug log

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token verification failed",
      });
    }
  }
};

// Middleware tambahan untuk optional authentication (untuk route yang tidak wajib login)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = {
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
      ...decoded,
    };
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  verifyToken,
  optionalAuth,
};
