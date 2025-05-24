const RetinaHistoryService = require("../../services/RetinaServices");

class RetinaHistoryController {
  constructor() {
    this.retinaHistoryService = new RetinaHistoryService();
  }

  updateSavedStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { savedStatus } = req.body;
      const userId = req.user.id; // dari token yang sudah diverifikasi

      const updatedRecord = await this.retinaHistoryService.updateSavedStatus(
        id,
        userId,
        savedStatus
      );

      res.status(200).json({
        success: true,
        message: "Status berhasil diupdate",
        data: updatedRecord,
      });
    } catch (error) {
      console.error("Error updating saved status:", error);

      // Handle custom error dengan statusCode
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      // Handle validation errors
      if (error.message.includes("User ID tidak ditemukan")) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("savedStatus harus")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // Handle server errors
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  };

  getRetinaHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const { saved } = req.query; // optional query parameter

      const retinaHistory = await this.retinaHistoryService.getRetinaHistory(
        userId,
        saved
      );

      res.status(200).json({
        success: true,
        message: "Data retina history berhasil diambil",
        data: retinaHistory,
      });
    } catch (error) {
      console.error("Error getting retina history:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  };

  getSavedRetinaHistory = async (req, res) => {
    try {
      const userId = req.user.id;

      const savedHistory =
        await this.retinaHistoryService.getSavedRetinaHistory(userId);

      res.status(200).json({
        success: true,
        message: "Data saved retina history berhasil diambil",
        data: savedHistory,
      });
    } catch (error) {
      console.error("Error getting saved retina history:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  };

  deleteRetinaHistory = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.retinaHistoryService.deleteRetinaHistory(
        id,
        userId
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error("Error deleting retina history:", error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  };
}

module.exports = RetinaHistoryController;
