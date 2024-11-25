/*
  Warnings:

  - Made the column `created_at` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);
