const { PrismaClient } = require("@prisma/client");

// Singleton pattern: wajib di Vercel/serverless agar koneksi tidak dobel
// setiap cold start atau hot reload.
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

// Prisma terkoneksi secara lazy (otomatis saat query pertama).
// Tidak perlu $connect() eksplisit — ini justru membuang slot koneksi
// di lingkungan serverless.
module.exports = { prisma };
