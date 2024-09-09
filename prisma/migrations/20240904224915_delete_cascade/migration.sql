/*
  Warnings:

  - A unique constraint covering the columns `[report_id]` on the table `TechnicalSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Annex" DROP CONSTRAINT "Annex_report_id_fkey";

-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_report_id_fkey";

-- DropForeignKey
ALTER TABLE "TechnicalSummary" DROP CONSTRAINT "TechnicalSummary_report_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSummary_report_id_key" ON "TechnicalSummary"("report_id");

-- AddForeignKey
ALTER TABLE "TechnicalSummary" ADD CONSTRAINT "TechnicalSummary_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annex" ADD CONSTRAINT "Annex_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
