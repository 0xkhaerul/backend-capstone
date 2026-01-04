const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const { sendOTPEmail } = require("../config/email");
const { generateOTP, getOTPExpiry } = require("../utils/otpGenerator");
const { updateUserProfile } = require("../repositories/userRepository");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Password are required" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    // Jika user sudah ada dan sudah verified, return error
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    let user;

    // Jika user sudah ada tapi belum verified, update data user
    if (existingUser && !existingUser.isVerified) {
      user = await prisma.users.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          isVerified: false,
          otpCode,
          otpExpiry,
          updatedAt: new Date(),
        },
      });
    } else {
      // Jika user belum ada, buat user baru
      const userId = `user-${nanoid()}`;
      user = await prisma.users.create({
        data: {
          id: userId,
          name,
          email,
          password: hashedPassword,
          isVerified: false,
          otpCode,
          otpExpiry,
        },
      });
    }

    // Kirim OTP via email
    const emailSent = await sendOTPEmail(email, otpCode, name);

    if (!emailSent) {
      // Jika email gagal dikirim dan ini adalah user baru, hapus user
      if (!existingUser) {
        await prisma.users.delete({
          where: { id: user.id },
        });
      }
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    // Hapus password dan OTP dari response
    const { password: _, otpCode: __, ...userWithoutSensitiveData } = user;

    res.status(201).json({
      message: existingUser
        ? "User data updated successfully. Please check your email for OTP verification."
        : "User created successfully. Please check your email for OTP verification.",
      user: userWithoutSensitiveData,
      otpSent: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Menggunakan user ID dari token yang sudah diverifikasi oleh middleware
    const userId = req.user.id;

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        noTelp: true,
        age: true,
        kecamatan: true,
        kabupaten: true,
        kota: true,
        negara: true,
        tanggalLahir: true,
        jenisKelamin: true,
        // Tidak mengambil password untuk keamanan
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving profile", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        message: "Email and OTP code are required",
      });
    }

    // Cari user berdasarkan email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // Cek apakah OTP sudah expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP code has expired. Please request a new one.",
      });
    }

    // Cek apakah OTP sesuai
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Update user menjadi verified dan hapus OTP
    const verifiedUser = await prisma.users.update({
      where: { email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    });

    const {
      password: _,
      otpCode: __,
      otpExpiry: ___,
      ...userWithoutSensitiveData
    } = verifiedUser;

    res.status(200).json({
      message: "Account verified successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const newOtpCode = generateOTP();
    const newOtpExpiry = getOTPExpiry();

    // Update OTP baru
    await prisma.users.update({
      where: { email },
      data: {
        otpCode: newOtpCode,
        otpExpiry: newOtpExpiry,
      },
    });

    // Kirim OTP baru via email
    const emailSent = await sendOTPEmail(email, newOtpCode, user.name);

    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(200).json({
      message: "New OTP sent successfully. Please check your email.",
      otpSent: true,
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      message: "Error resending OTP",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      no_telp,
      age,
      kecamatan,
      kabupaten,
      kota,
      negara,
      tanggal_lahir,
      jenis_kelamin,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const updatedUser = await updateUserProfile(
      userId,
      no_telp,
      age,
      kecamatan,
      kabupaten,
      kota,
      negara,
      tanggal_lahir,
      jenis_kelamin
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  getProfile,
  verifyOTP,
  resendOTP,
  updateProfile,
};
