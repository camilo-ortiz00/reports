/*
  Warnings:

  - Added the required column `createdBy` to the `FileSystemNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileSystemNode" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FileSystemNode" ADD CONSTRAINT "FileSystemNode_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;