// services/loginService.js (Updated)
const userRepository = require("../repositories/userRepository");
const { verifyPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/tokenUtils");

const loginService = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Cek apakah email sudah diverifikasi
  if (!user.isVerified) {
    throw new Error(
      "Please verify your email first. Check your inbox for OTP code."
    );
  }

  const token = generateToken(user);

  return {
    error: false,
    message: "Login successful",
    loginResult: {
      userId: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token,
    },
  };
};

module.exports = { loginService };
