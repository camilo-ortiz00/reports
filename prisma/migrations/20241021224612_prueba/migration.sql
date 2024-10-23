-- CreateTable
CREATE TABLE "ReportTracking" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "ReportTracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportTracking" ADD CONSTRAINT "ReportTracking_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
