const userRepository = require("../../repositories/userRepository");
const FormCheckHistoryRepository = require("../../repositories/formCheckHistoryRepository");
const { verifyPassword } = require("../../utils/passwordUtils");
const { generateToken } = require("../../utils/tokenUtils");

// Inisialisasi instance class
const formCheckRepository = new FormCheckHistoryRepository();

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required",
      });
    }

    // Cari user berdasarkan email
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    // Verifikasi password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    // Cek apakah email sudah diverifikasi
    if (!user.isVerified) {
      return res.status(403).json({
        error: true,
        message:
          "Please verify your email first. Check your inbox for OTP code.",
        requiresVerification: true,
        action: "Please verify your email using OTP code sent to your inbox",
      });
    }

    // Generate token
    const token = generateToken(user);

    // Response sukses
    return res.status(200).json({
      error: false,
      message: "Login successful",
      loginResult: {
        userId: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      error: true,
      message: "Error during login",
      detail: error.message,
    });
  }
};

module.exports = { loginUser };
