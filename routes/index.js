const express = require("express");
const authRoutes = require("./authRoutes");

const router = express.Router();

// kumpulan routes
router.use("/", authRoutes);
router.use("/content/imageslider", require("./imagesliderRoutes"));

module.exports = router;
