const express = require("express");
const RetinaHistoryController = require("../controllers/saveHistory/RetinaUserController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// Instantiate controller
const retinaHistoryController = new RetinaHistoryController();

// PUT - Update saved status
router.put("/:id", verifyToken, retinaHistoryController.updateSavedStatus);

// GET - Get all retina history for user (with optional filter)
router.get("/", verifyToken, retinaHistoryController.getRetinaHistory);

// GET - Get only saved retina history
router.get(
  "/saved",
  verifyToken,
  retinaHistoryController.getSavedRetinaHistory
);

module.exports = router;
