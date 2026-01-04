-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "jenisKelamin" TEXT,
ADD COLUMN     "kabupaten" TEXT,
ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "kota" TEXT,
ADD COLUMN     "negara" TEXT,
ADD COLUMN     "noTelp" TEXT,
ADD COLUMN     "tanggalLahir" TIMESTAMP(3);
