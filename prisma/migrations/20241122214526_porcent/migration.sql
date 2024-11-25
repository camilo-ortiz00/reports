/*
  Warnings:

  - You are about to drop the column `status` on the `ReportTracking` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ReportTracking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "percent_cumulative" DOUBLE PRECISION,
ADD COLUMN     "percent_month" DOUBLE PRECISION,
ALTER COLUMN "approved_changes" DROP NOT NULL,
ALTER COLUMN "contingency_plan" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReportTracking" DROP COLUMN "status",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "TechnicalSummary" ALTER COLUMN "observations" DROP NOT NULL;
