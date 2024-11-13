-- DropForeignKey
ALTER TABLE "Annex" DROP CONSTRAINT "Annex_report_id_fkey";

-- AddForeignKey
ALTER TABLE "Annex" ADD CONSTRAINT "Annex_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
