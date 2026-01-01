const { prisma } = require("../config/db");

class FormCheckHistoryRepository {
  // Find all form check history for a specific user
  async findByUserId(userId) {
    return await prisma.formCheckHistory.findMany({
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
  }

  // Find form check history by ID and user ID
  async findByIdAndUserId(id, userId) {
    return await prisma.formCheckHistory.findFirst({
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

  // Update form check history by ID
  async updateById(id, data) {
    return await prisma.formCheckHistory.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  // Delete form check history by ID
  async deleteById(id) {
    return await prisma.formCheckHistory.delete({
      where: {
        id: id,
      },
    });
  }

  // Check if record exists by ID and user ID
  async existsByIdAndUserId(id, userId) {
    const record = await prisma.formCheckHistory.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    return record !== null;
  }
}

module.exports = FormCheckHistoryRepository;
