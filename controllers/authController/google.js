const jwt = require("jsonwebtoken");
const { generateToken } = require("../../utils/tokenUtils");
const { prisma } = require("../../config/db");

const FRONTEND_BASE =
  process.env.FRONTEND_URL || "https://capstone-dbs-react.vercel.app";

const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: true, message: "Authentication failed" });
    }

    // If passport returned a temp object it means user not found in DB
    if (req.user.temp) {
      // Create a short-lived token to allow front-end to complete registration
      const payload = {
        email: req.user.email,
        googleId: req.user.googleId,
        name: req.user.name,
        type: "google_register",
      };

      const tmpToken = jwt.sign(
        payload,
        process.env.JWT_SECRET || "tmp_secret",
        {
          expiresIn: "10m",
          algorithm: "HS256",
        }
      );

      // Redirect to frontend registration completion page with temp token
      const redirectUrl = `${FRONTEND_BASE}/auth/google-complete?token=${tmpToken}`;

      return res.redirect(302, redirectUrl);
    }

    // Existing user: generate normal token and redirect to frontend with it
    const token = generateToken(req.user);

    const redirectUrl = `${FRONTEND_BASE}/auth/google-success?token=${token}`;

    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Complete registration for users who signed in with Google but don't exist yet
const completeGoogleRegister = async (req, res) => {
  try {
    const { token: tmpToken, name } = req.body;

    if (!tmpToken) {
      return res.status(400).json({ error: true, message: "Missing token" });
    }

    let payload;
    try {
      payload = jwt.verify(tmpToken, process.env.JWT_SECRET || "tmp_secret", {
        algorithms: ["HS256"],
      });
    } catch (err) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid or expired token" });
    }

    if (payload.type !== "google_register") {
      return res
        .status(400)
        .json({ error: true, message: "Invalid token type" });
    }

    const { email, googleId } = payload;

    // If user already exists, just return normal token
    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      // Create user with provided name (or fallback to name from payload)
      const newUser = await prisma.users.create({
        data: {
          id: `user-${googleId}`,
          name: name || payload.name || "",
          email,
          googleId,
          isVerified: true,
        },
      });

      user = newUser;
    }

    const token = generateToken(user);

    return res.status(200).json({
      error: false,
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("completeGoogleRegister error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = { googleCallback, completeGoogleRegister };
