const express = require("express");
const {
  createUser,
  getProfile,
} = require("../controllers/createUserController");
const { loginUser } = require("../controllers/authController/login");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// create user
router.post("/users", createUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getProfile);

module.exports = router;
