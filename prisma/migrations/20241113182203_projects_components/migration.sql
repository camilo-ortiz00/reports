/*
  Warnings:

  - You are about to drop the column `url` on the `Annex` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `work_lines` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `support_annex` on the `TechnicalSummary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identity_document]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file` to the `Annex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_technical` to the `TechnicalSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity_document` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annex" DROP COLUMN "url",
ADD COLUMN     "file" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "project_id",
DROP COLUMN "work_lines",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Deliverable" ADD COLUMN     "support_annex" TEXT NOT NULL DEFAULT 'Sin soporte';

-- AlterTable
ALTER TABLE "TechnicalSummary" DROP COLUMN "support_annex",
ADD COLUMN     "name_technical" TEXT NOT NULL,
ADD COLUMN     "support_annex_id" INTEGER;

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ADD COLUMN     "blood_type" TEXT,
ADD COLUMN     "identity_document" TEXT NOT NULL,
ADD COLUMN     "marital_status" TEXT,
ADD COLUMN     "profile_status" DOUBLE PRECISION,
ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";

-- CreateIndex
CREATE UNIQUE INDEX "User_identity_document_key" ON "User"("identity_document");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSummary" ADD CONSTRAINT "TechnicalSummary_support_annex_id_fkey" FOREIGN KEY ("support_annex_id") REFERENCES "Annex"("id") ON DELETE SET NULL ON UPDATE CASCADE;
