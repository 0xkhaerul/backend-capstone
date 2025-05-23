const RetinaHistoryRepository = require("../repositories/saveRetinaRepository");

class RetinaHistoryService {
  constructor() {
    this.retinaHistoryRepository = new RetinaHistoryRepository();
  }

  async updateSavedStatus(id, userId, savedStatus) {
    // Validasi user ID
    if (!userId) {
      throw new Error("User ID tidak ditemukan dalam token");
    }

    // Validasi input - hanya terima null atau true
    if (savedStatus !== null && savedStatus !== true) {
      throw new Error("savedStatus harus null atau true");
    }

    // Cek apakah record exists dan milik user yang sedang login
    const existingRecord = await this.retinaHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!existingRecord) {
      const error = new Error(
        "Data retina history tidak ditemukan atau bukan milik Anda"
      );
      error.statusCode = 404;
      throw error;
    }

    // Double check: pastikan userId cocok (extra security)
    if (existingRecord.userId !== userId) {
      const error = new Error("Akses ditolak - data bukan milik Anda");
      error.statusCode = 403;
      throw error;
    }

    // Update savedStatus
    const updatedRecord = await this.retinaHistoryRepository.updateSavedStatus(
      id,
      savedStatus
    );

    return updatedRecord;
  }

  async getRetinaHistory(userId, savedFilter) {
    let whereCondition = {};

    // Filter berdasarkan saved status jika ada query parameter
    if (savedFilter !== undefined) {
      if (savedFilter === "true") {
        whereCondition.savedStatus = true;
      } else if (savedFilter === "false") {
        whereCondition.savedStatus = null;
      }
    }

    const retinaHistory = await this.retinaHistoryRepository.findManyByUserId(
      userId,
      whereCondition
    );

    return retinaHistory;
  }

  async getSavedRetinaHistory(userId) {
    const savedHistory = await this.retinaHistoryRepository.findSavedByUserId(
      userId
    );

    return savedHistory;
  }
}

module.exports = RetinaHistoryService;
