-- DropIndex
DROP INDEX "TechnicalSummary_report_id_key";

-- AlterTable
ALTER TABLE "TechnicalSummary" ALTER COLUMN "support_annex" DROP DEFAULT;
