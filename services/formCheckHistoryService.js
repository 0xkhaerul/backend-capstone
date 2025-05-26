const FormCheckHistoryRepository = require("../repositories/formCheckHistoryRepository");

class FormCheckHistoryService {
  constructor() {
    this.formCheckHistoryRepository = new FormCheckHistoryRepository();
  }

  // Get all form check history for user
  async getAllFormCheckHistory(userId) {
    try {
      const formCheckHistory =
        await this.formCheckHistoryRepository.findByUserId(userId);
      return {
        success: true,
        message: "Form check history retrieved successfully",
        data: formCheckHistory,
      };
    } catch (error) {
      throw new Error(`Failed to get form check history: ${error.message}`);
    }
  }

  // Get form check history detail by ID
  async getFormCheckHistoryDetail(id, userId) {
    try {
      const formCheckHistory =
        await this.formCheckHistoryRepository.findByIdAndUserId(id, userId);

      if (!formCheckHistory) {
        return {
          success: false,
          message: "Form check history not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: "Form check history detail retrieved successfully",
        data: formCheckHistory,
      };
    } catch (error) {
      throw new Error(
        `Failed to get form check history detail: ${error.message}`
      );
    }
  }

  // Update form check history
  async updateFormCheckHistory(id, userId, updateFields) {
    try {
      // Check if record exists and belongs to user
      const exists = await this.formCheckHistoryRepository.existsByIdAndUserId(
        id,
        userId
      );

      if (!exists) {
        return {
          success: false,
          message: "Form check history not found",
          statusCode: 404,
        };
      }

      // Prepare update data with validation and type conversion
      const updateData = this._prepareUpdateData(updateFields);

      const updatedFormCheckHistory =
        await this.formCheckHistoryRepository.updateById(id, updateData);

      return {
        success: true,
        message: "Form check history updated successfully",
        data: updatedFormCheckHistory,
      };
    } catch (error) {
      throw new Error(`Failed to update form check history: ${error.message}`);
    }
  }

  // Delete form check history
  async deleteFormCheckHistory(id, userId) {
    try {
      // Check if record exists and belongs to user
      const exists = await this.formCheckHistoryRepository.existsByIdAndUserId(
        id,
        userId
      );

      if (!exists) {
        return {
          success: false,
          message: "Form check history not found",
          statusCode: 404,
        };
      }

      await this.formCheckHistoryRepository.deleteById(id);

      return {
        success: true,
        message: "Form check history deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete form check history: ${error.message}`);
    }
  }

  // Private method to prepare update data
  _prepareUpdateData(fields) {
    const {
      hypertension,
      heartDisease,
      bmi,
      bloodGlucoseLevel,
      hba1cLevel,
      smokingHistory,
      predictionResult,
      age,
      gender,
    } = fields;

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
    if (age !== undefined) updateData.age = parseInt(age);
    if (gender !== undefined) updateData.gender = gender;

    return updateData;
  }
}

module.exports = FormCheckHistoryService;
