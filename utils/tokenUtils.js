const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!user || !user.id) {
    throw new Error("User data tidak valid untuk generate token");
  }

  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    id: user.id,
  };

  // Validasi environment variable
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tidak ditemukan di environment variables");
  }

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Gagal membuat token");
  }
};

const refreshToken = (oldToken) => {
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, {
      ignoreExpiration: true,
      algorithms: ["HS256"],
    });

    const newPayload = {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
      id: decoded.userId || decoded.id,
    };

    return jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Gagal refresh token");
  }
};

module.exports = {
  generateToken,
  refreshToken,
};
