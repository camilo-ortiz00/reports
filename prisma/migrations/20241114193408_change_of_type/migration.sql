/*
  Warnings:

  - The `cv_file` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `academic_support_files` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_file` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profile_picture` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `profile_status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Changed the type of `support_annex` on the `Deliverable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Deliverable" DROP COLUMN "support_annex",
ADD COLUMN     "support_annex" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cv_file",
ADD COLUMN     "cv_file" BYTEA,
DROP COLUMN "academic_support_files",
ADD COLUMN     "academic_support_files" BYTEA,
DROP COLUMN "id_file",
ADD COLUMN     "id_file" BYTEA,
DROP COLUMN "profile_picture",
ADD COLUMN     "profile_picture" BYTEA,
ALTER COLUMN "profile_status" SET DATA TYPE DECIMAL(65,30);
