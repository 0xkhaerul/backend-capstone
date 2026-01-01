const express = require("express");
const {
  getFormCheckHistoryDetail,
  deleteFormCheckHistory,
  saveFormCheckHistory,
  unsaveFormCheckHistory,
} = require("../controllers/formCheckHistory/formCheckHistoryController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// GET detail
router.get("/:id", verifyToken, getFormCheckHistoryDetail);

// PATCH untuk save/unsave (lebih semantic karena hanya update sebagian field)
router.patch("/:id/save", verifyToken, saveFormCheckHistory);
router.patch("/:id/unsave", verifyToken, unsaveFormCheckHistory);

// DELETE
router.delete("/:id", verifyToken, deleteFormCheckHistory);

module.exports = router;
