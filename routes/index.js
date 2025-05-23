// routes/index.js
const express = require("express");
const authRoutes = require("./authRoutes");
const savedRetinaHistoryRoutes = require("./savedRetinaHistory");

const router = express.Router();

// kumpulan routes
router.use("/", authRoutes);
router.use("/saved-retina-user", savedRetinaHistoryRoutes);

router.use("/content/imageslider", require("./imagesliderRoutes"));

module.exports = router;
