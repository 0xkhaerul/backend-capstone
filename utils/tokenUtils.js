const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // Pastikan user object memiliki data yang diperlukan
  if (!user || !user.id) {
    throw new Error("User data tidak valid untuk generate token");
  }

  // Struktur payload yang konsisten dan aman
  const payload = {
    id: user.id, // WAJIB - primary identifier
    email: user.email, // untuk identifikasi tambahan
    name: user.name, // untuk display name
    // JANGAN masukkan password, sensitif data, atau data yang tidak perlu
  };

  // Validasi environment variable
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tidak ditemukan di environment variables");
  }

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
      issuer: "your-app-name", // optional: nama aplikasi
      audience: "your-app-users", // optional: target audience
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Gagal membuat token");
  }
};

const refreshToken = (oldToken) => {
  try {
    // Verify token lama (bisa expired)
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, {
      ignoreExpiration: true, // ignore expiration untuk refresh
    });

    // Buat payload baru (tanpa exp, iat, dll)
    const newPayload = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    // Generate token baru
    return generateToken(newPayload);
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Gagal refresh token");
  }
};

module.exports = {
  generateToken,
  refreshToken,
};
