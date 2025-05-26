const FormCheckHistoryService = require("../../services/formCheckHistoryService");

class FormCheckHistoryController {
  constructor() {
    this.formCheckHistoryService = new FormCheckHistoryService();

    // Bind methods to preserve 'this' context
    this.getAllFormCheckHistory = this.getAllFormCheckHistory.bind(this);
    this.getFormCheckHistoryDetail = this.getFormCheckHistoryDetail.bind(this);
    this.updateFormCheckHistory = this.updateFormCheckHistory.bind(this);
    this.deleteFormCheckHistory = this.deleteFormCheckHistory.bind(this);
  }

  // GET - Get all form check history for user
  async getAllFormCheckHistory(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID comes from verifyToken middleware

      const result = await this.formCheckHistoryService.getAllFormCheckHistory(
        userId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error getting form check history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // GET - Get detail form check history by ID
  async getFormCheckHistoryDetail(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result =
        await this.formCheckHistoryService.getFormCheckHistoryDetail(
          id,
          userId
        );

      if (!result.success && result.statusCode === 404) {
        return res.status(404).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error getting form check history detail:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // PUT - Update form check history
  async updateFormCheckHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateFields = req.body;

      const result = await this.formCheckHistoryService.updateFormCheckHistory(
        id,
        userId,
        updateFields
      );

      if (!result.success && result.statusCode === 404) {
        return res.status(404).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating form check history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // DELETE - Delete form check history
  async deleteFormCheckHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.formCheckHistoryService.deleteFormCheckHistory(
        id,
        userId
      );

      if (!result.success && result.statusCode === 404) {
        return res.status(404).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting form check history:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = FormCheckHistoryController;
