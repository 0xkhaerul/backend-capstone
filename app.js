require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const { prisma } = require("./config/db"); // singleton — import cukup sekali
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

// Load Google OAuth strategy
require("./config/google");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CORS CONFIGURATION
========================= */
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport init (no session)
app.use(passport.initialize());

/* =========================
   ROUTES
========================= */
app.use("/v1", routes);

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({ message: "Backend Capstone API is running 🚀" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   SERVER START
   Di Vercel (serverless) app.js di-export langsung — tidak ada
   persistent server. app.listen() hanya dijalankan saat local dev.
========================= */
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Graceful shutdown: tutup koneksi Prisma saat proses dihentikan
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = app;
