/*
  Warnings:

  - Added the required column `predictionResult` to the `form_check_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "form_check_history" ADD COLUMN     "predictionResult" TEXT NOT NULL;
