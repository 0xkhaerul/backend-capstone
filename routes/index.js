// routes/index.js
const express = require("express");
const authRoutes = require("./authRoutes");
// const savedRetinaHistoryRoutes = require("./RetinaHistory.js");
const formCheckHistoryRoutes = require("./formCheckRoutes.js");

const router = express.Router();

// kumpulan routes
router.use("/", authRoutes);
// router.use("/retina-user", savedRetinaHistoryRoutes);
router.use("/form-check-history", formCheckHistoryRoutes);

module.exports = router;
