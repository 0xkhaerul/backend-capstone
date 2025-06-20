const express = require("express");
const {
  createUser,
  getProfile,
  verifyOTP,
  resendOTP,
} = require("../controllers/createUserController");
const { loginUser } = require("../controllers/authController/login");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// create user
router.post("/users", createUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getProfile);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Resend OTP
router.post("/resend-otp", resendOTP);

module.exports = router;
