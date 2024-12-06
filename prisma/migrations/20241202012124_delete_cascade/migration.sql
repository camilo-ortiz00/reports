-- DropForeignKey
ALTER TABLE "ReportTracking" DROP CONSTRAINT "ReportTracking_report_id_fkey";

-- AddForeignKey
ALTER TABLE "ReportTracking" ADD CONSTRAINT "ReportTracking_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
