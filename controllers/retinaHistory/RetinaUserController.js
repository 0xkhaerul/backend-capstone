const RetinaHistoryRepository = require("../../repositories/retinaRepository");
const cloudinary = require("cloudinary").v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const retinaHistoryRepository = new RetinaHistoryRepository();

// GET - Get all retina history
const getRetinaHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { saved } = req.query;

    let whereCondition = {};

    // Filter berdasarkan saved status jika ada query parameter
    if (saved !== undefined) {
      if (saved === "true") {
        whereCondition.savedStatus = true;
      } else if (saved === "false") {
        whereCondition.savedStatus = null;
      }
    }

    const retinaHistory = await retinaHistoryRepository.findManyByUserId(
      userId,
      whereCondition
    );

    return res.status(200).json({
      success: true,
      message: "Data retina history berhasil diambil",
      data: retinaHistory,
    });
  } catch (error) {
    console.error("Error getting retina history:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// GET - Get detail retina history by ID
const getRetinaHistoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const retinaHistory = await retinaHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!retinaHistory) {
      return res.status(404).json({
        success: false,
        message: "Data retina history tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detail retina history berhasil diambil",
      data: retinaHistory,
    });
  } catch (error) {
    console.error("Error getting retina history detail:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// PATCH - Save retina history
const saveRetinaHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Cek apakah record exists dan milik user
    const existingRecord = await retinaHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Data retina history tidak ditemukan atau bukan milik Anda",
      });
    }

    // Update savedStatus to true
    const updatedRecord = await retinaHistoryRepository.updateSavedStatus(
      id,
      true
    );

    return res.status(200).json({
      success: true,
      message: "Retina history berhasil disimpan",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error saving retina history:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// PATCH - Unsave retina history
const unsaveRetinaHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Cek apakah record exists dan milik user
    const existingRecord = await retinaHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Data retina history tidak ditemukan atau bukan milik Anda",
      });
    }

    // Update savedStatus to null
    const updatedRecord = await retinaHistoryRepository.updateSavedStatus(
      id,
      null
    );

    return res.status(200).json({
      success: true,
      message: "Retina history berhasil diunsave",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error unsaving retina history:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// DELETE - Delete retina history
const deleteRetinaHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User tidak terautentikasi",
      });
    }

    // Cek apakah record exists dan milik user
    const existingRecord = await retinaHistoryRepository.findByIdAndUserId(
      id,
      userId
    );

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Data retina history tidak ditemukan atau bukan milik Anda",
      });
    }

    // Hapus gambar dari Cloudinary jika ada
    try {
      if (existingRecord.imageId) {
        await cloudinary.uploader.destroy(existingRecord.imageId);
      }
    } catch (cloudinaryError) {
      console.error("Error deleting image from Cloudinary:", cloudinaryError);
      // Lanjutkan proses delete meskipun gagal hapus dari Cloudinary
    }

    // Hapus record dari database
    await retinaHistoryRepository.deleteByIdAndUserId(id, userId);

    return res.status(200).json({
      success: true,
      message: "Data dan gambar berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting retina history:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

module.exports = {
  getRetinaHistory,
  getRetinaHistoryDetail,
  saveRetinaHistory,
  unsaveRetinaHistory,
  deleteRetinaHistory,
};
