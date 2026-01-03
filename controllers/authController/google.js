const { generateToken } = require("../../utils/tokenUtils");

const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, message: "Authentication failed" });
    }

    const token = generateToken(req.user);

    return res.status(200).json({
      error: false,
      message: "Login with Google successful",
      loginResult: {
        userId: req.user.id,
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isVerified,
        token,
      },
    });
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = { googleCallback };
