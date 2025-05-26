const express = require("express");
const FormCheckHistoryController = require("../controllers/formCheckHistory/formCheckHistoryController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

// Instantiate controller
const formCheckHistoryController = new FormCheckHistoryController();

// GET - Get all form check history for user
router.get("/", verifyToken, formCheckHistoryController.getAllFormCheckHistory);

// GET - Get detail form check history by ID
router.get(
  "/:id",
  verifyToken,
  formCheckHistoryController.getFormCheckHistoryDetail
);

// PUT - Update form check history
router.put(
  "/:id",
  verifyToken,
  formCheckHistoryController.updateFormCheckHistory
);

// DELETE - Delete form check history
router.delete(
  "/:id",
  verifyToken,
  formCheckHistoryController.deleteFormCheckHistory
);

module.exports = router;
