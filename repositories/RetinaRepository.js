const { prisma } = require("../config/db");

class RetinaHistoryRepository {
  // Find retina history by ID and user ID
  async findByIdAndUserId(id, userId) {
    return await prisma.retinaHistory.findFirst({
      where: {
        id: id,
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
    });
  }

  // Update saved status
  async updateSavedStatus(id, savedStatus) {
    return await prisma.retinaHistory.update({
      where: {
        id: id,
      },
      data: {
        savedStatus: savedStatus,
        updatedAt: new Date(),
      },
    });
  }

  // Delete retina history by ID and user ID
  async deleteByIdAndUserId(id, userId) {
    return await prisma.retinaHistory.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

  // Find many retina history by user ID with optional filter
  async findManyByUserId(userId, whereCondition = {}) {
    const condition = {
      userId: userId,
      ...whereCondition,
    };

    return await prisma.retinaHistory.findMany({
      where: condition,
      orderBy: {
        createdAt: "desc",
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
  }

  // Find saved retina history by user ID
  async findSavedByUserId(userId) {
    return await prisma.retinaHistory.findMany({
      where: {
        userId: userId,
        savedStatus: true,
      },
      orderBy: {
        createdAt: "desc",
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
  }
}

module.exports = RetinaHistoryRepository;
