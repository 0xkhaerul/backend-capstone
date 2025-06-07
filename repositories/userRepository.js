// repositories/userRepository.js (Updated)
const { prisma } = require("../config/db");

const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      isVerified: true,
      otpCode: true,
      otpExpiry: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Tambahan helper functions untuk OTP verification
const findUserByEmailForOTP = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      isVerified: true,
      otpCode: true,
      otpExpiry: true,
    },
  });
};

const updateUserVerification = async (email, updateData) => {
  return await prisma.users.update({
    where: { email },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUserOTP = async (email, otpCode, otpExpiry) => {
  return await prisma.users.update({
    where: { email },
    data: {
      otpCode,
      otpExpiry,
    },
  });
};

module.exports = {
  findUserByEmail,
  findUserByEmailForOTP,
  updateUserVerification,
  updateUserOTP,
};
