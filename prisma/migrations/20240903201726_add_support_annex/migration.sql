/*
  Warnings:

  - You are about to drop the column `support_annex` on the `Deliverable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[report_id]` on the table `TechnicalSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deliverable" DROP COLUMN "support_annex";

-- AlterTable
ALTER TABLE "TechnicalSummary" ADD COLUMN     "support_annex" TEXT NOT NULL DEFAULT 'default_value';

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSummary_report_id_key" ON "TechnicalSummary"("report_id");
