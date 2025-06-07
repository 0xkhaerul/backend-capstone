const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate nanoid untuk ID user
    const userId = `user-${nanoid()}`;

    const user = await prisma.users.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
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

module.exports = { createUser, getProfile };
