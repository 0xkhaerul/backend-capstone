const FormCheckHistoryRepository = require("../../repositories/formCheckHistoryRepository");

const formCheckHistoryRepository = new FormCheckHistoryRepository();

// GET - Get detail form check history by ID
const getFormCheckHistoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const formCheckHistory = await formCheckHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!formCheckHistory) {
      return res.status(404).json({
        success: false,
        message: "Form check history not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form check history detail retrieved successfully",
      data: formCheckHistory,
    });
  } catch (error) {
    console.error("Error getting form check history detail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// PATCH - Save form check history
const saveFormCheckHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Form check history id is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if record exists and belongs to user
    const exists = await formCheckHistoryRepository.existsByIdAndUserId(
      id,
      userId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Form check history not found",
      });
    }

    // Update isSaved to true
    const updated = await formCheckHistoryRepository.updateById(id, {
      isSaved: true,
    });

    return res.status(200).json({
      success: true,
      message: "Form check history saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving form check history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// PATCH - Unsave form check history
const unsaveFormCheckHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Form check history id is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if record exists and belongs to user
    const exists = await formCheckHistoryRepository.existsByIdAndUserId(
      id,
      userId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Form check history not found",
      });
    }

    // Update isSaved to false
    const updated = await formCheckHistoryRepository.updateById(id, {
      isSaved: false,
    });

    return res.status(200).json({
      success: true,
      message: "Form check history unsaved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error unsaving form check history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// DELETE - Delete form check history
const deleteFormCheckHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if record exists and belongs to user
    const exists = await formCheckHistoryRepository.existsByIdAndUserId(
      id,
      userId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Form check history not found",
      });
    }

    await formCheckHistoryRepository.deleteById(id);

    return res.status(200).json({
      success: true,
      message: "Form check history deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting form check history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getFormCheckHistoryDetail,
  saveFormCheckHistory,
  unsaveFormCheckHistory,
  deleteFormCheckHistory,
};
