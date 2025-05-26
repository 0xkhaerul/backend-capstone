const { prisma } = require("../../config/db");

class FormCheckHistoryController {
  // GET - Get all form check history for user
  async getAllFormCheckHistory(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID comes from verifyToken middleware

      const formCheckHistory = await prisma.formCheckHistory.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Form check history retrieved successfully",
        data: formCheckHistory,
      });
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

      const formCheckHistory = await prisma.formCheckHistory.findFirst({
        where: {
          id: id,
          userId: userId, // Ensure user can only access their own data
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

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
  }

  // PUT - Update form check history
  async updateFormCheckHistory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const {
        hypertension,
        heartDisease,
        bmi,
        bloodGlucoseLevel,
        hba1cLevel,
        smokingHistory,
        predictionResult,
      } = req.body;

      // Check if the record exists and belongs to the user
      const existingRecord = await prisma.formCheckHistory.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingRecord) {
        return res.status(404).json({
          success: false,
          message: "Form check history not found",
        });
      }

      // Prepare update data (only include fields that are provided)
      const updateData = {};
      if (hypertension !== undefined) updateData.hypertension = hypertension;
      if (heartDisease !== undefined) updateData.heartDisease = heartDisease;
      if (bmi !== undefined) updateData.bmi = parseFloat(bmi);
      if (bloodGlucoseLevel !== undefined)
        updateData.bloodGlucoseLevel = parseFloat(bloodGlucoseLevel);
      if (hba1cLevel !== undefined)
        updateData.hba1cLevel = parseFloat(hba1cLevel);
      if (smokingHistory !== undefined)
        updateData.smokingHistory = smokingHistory;
      if (predictionResult !== undefined)
        updateData.predictionResult = predictionResult;

      const updatedFormCheckHistory = await prisma.formCheckHistory.update({
        where: {
          id: id,
        },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Form check history updated successfully",
        data: updatedFormCheckHistory,
      });
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

      // Check if the record exists and belongs to the user
      const existingRecord = await prisma.formCheckHistory.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });

      if (!existingRecord) {
        return res.status(404).json({
          success: false,
          message: "Form check history not found",
        });
      }

      await prisma.formCheckHistory.delete({
        where: {
          id: id,
        },
      });

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
  }
}

module.exports = FormCheckHistoryController;
