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
const passport = require("passport");
const { googleCallback } = require("../controllers/authController/google");
const {
  completeGoogleRegister,
} = require("../controllers/authController/google");

// create user
router.post("/users", createUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getProfile);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Resend OTP
router.post("/resend-otp", resendOTP);

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/login`
      : "https://capstone-dbs-react.vercel.app/login",
  }),
  googleCallback
);

// Endpoint for frontend to complete registration when Google profile lacks a user
router.post("/auth/google/complete", completeGoogleRegister);

module.exports = router;
