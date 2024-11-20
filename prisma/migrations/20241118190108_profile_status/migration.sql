/*
  Warnings:

  - You are about to alter the column `profile_status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profile_status" SET DATA TYPE DOUBLE PRECISION;
