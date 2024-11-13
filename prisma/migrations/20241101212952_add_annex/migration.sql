-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_report_id_fkey";

-- DropIndex
DROP INDEX "TechnicalSummary_support_annex_id_key";

-- AlterTable
ALTER TABLE "TechnicalSummary" ALTER COLUMN "name_technical" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
