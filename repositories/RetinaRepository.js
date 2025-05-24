const { prisma } = require("../config/db");

class RetinaHistoryRepository {
  async findByIdAndUserId(id, userId) {
    return await prisma.retinaHistory.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

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

  async deleteByIdAndUserId(id, userId) {
    return await prisma.retinaHistory.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }

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
