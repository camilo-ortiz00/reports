/*
  Warnings:

  - A unique constraint covering the columns `[identity_document]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `identity_document` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "identity_document" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_identity_document_key" ON "User"("identity_document");
