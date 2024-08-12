-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "phone" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "cv_file" TEXT NOT NULL,
    "academic_support_files" TEXT NOT NULL,
    "id_file" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "work_lines" TEXT NOT NULL,
    "contact_person_name" TEXT NOT NULL,
    "contact_person_phone" TEXT NOT NULL,
    "contact_person_email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "component_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTracking" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "ReportTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "work_lines" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annex" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Annex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "support_annex" TEXT NOT NULL,
    "approved_changes" TEXT NOT NULL,
    "contingency_plan" TEXT NOT NULL,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalSummary" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "obtained_result" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "support_annex" TEXT NOT NULL,
    "observations" TEXT NOT NULL,

    CONSTRAINT "TechnicalSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSummary_report_id_key" ON "TechnicalSummary"("report_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTracking" ADD CONSTRAINT "ReportTracking_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annex" ADD CONSTRAINT "Annex_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSummary" ADD CONSTRAINT "TechnicalSummary_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
