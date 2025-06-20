const loginService = require("../../services/loginService");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Panggil loginService dan langsung ambil hasil respons yang sudah diformat
    const result = await loginService.loginService(email, password);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Email and password are required") {
      return res.status(400).json({
        error: true,
        message: error.message,
      });
    }

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        error: true,
        message: error.message,
      });
    }

    // Handle email not verified error
    if (
      error.message ===
      "Please verify your email first. Check your inbox for OTP code."
    ) {
      return res.status(403).json({
        error: true,
        message: error.message,
        requiresVerification: true,
        action: "Please verify your email using OTP code sent to your inbox",
      });
    }

    res.status(500).json({
      error: true,
      message: "Error during login",
      detail: error.message,
    });
  }
};

module.exports = { loginUser };
