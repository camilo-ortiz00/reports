/*
  Warnings:

  - Added the required column `support_type` to the `Deliverable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annex" ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "file_type" TEXT;

-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "support_name" TEXT,
ADD COLUMN     "support_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academic_support_type" TEXT,
ADD COLUMN     "cv_file_type" TEXT,
ADD COLUMN     "id_file_type" TEXT,
ADD COLUMN     "profile_picture_name" TEXT,
ADD COLUMN     "profile_picture_type" TEXT;
