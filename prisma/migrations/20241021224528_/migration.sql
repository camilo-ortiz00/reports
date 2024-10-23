/*
  Warnings:

  - You are about to drop the `ReportTracking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportTracking" DROP CONSTRAINT "ReportTracking_report_id_fkey";

-- DropTable
DROP TABLE "ReportTracking";
