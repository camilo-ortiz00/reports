/*
  Warnings:

  - Added the required column `updated_at` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN "created_at" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "updated_at" TIMESTAMP DEFAULT NOW()