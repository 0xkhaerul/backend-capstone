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

const updateUserProfile = async (
  userId,
  no_telp,
  age,
  kecamatan,
  kabupaten,
  kota,
  negara,
  tanggal_lahir,
  jenis_kelamin
) => {
  return await prisma.users.update({
    where: { id: userId },
    data: {
      noTelp: no_telp ?? null,
      age: age ? Number(age) : null,
      kecamatan: kecamatan ?? null,
      kabupaten: kabupaten ?? null,
      kota: kota ?? null,
      negara: negara ?? null,
      tanggalLahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      jenisKelamin: jenis_kelamin ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      noTelp: true,
      age: true,
      kecamatan: true,
      kabupaten: true,
      kota: true,
      negara: true,
      tanggalLahir: true,
      jenisKelamin: true,
      updatedAt: true,
    },
  });
};

module.exports = {
  findUserByEmail,
  findUserByEmailForOTP,
  updateUserVerification,
  updateUserOTP,
  updateUserProfile,
};
