const express = require("express");
const {
  updateSavedStatus,
  getRetinaHistory,
  getSavedRetinaHistory,
  deleteRetinaHistory,
} = require("../controllers/retinaHistory/RetinaUserController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.put("/:id", verifyToken, updateSavedStatus);
router.get("/", verifyToken, getRetinaHistory);
router.get("/saved", verifyToken, getSavedRetinaHistory);
router.delete("/:id", verifyToken, deleteRetinaHistory);

module.exports = router;
