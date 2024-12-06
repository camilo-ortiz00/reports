/*
  Warnings:

  - You are about to drop the `FileSystem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('FILE', 'FOLDER');

-- DropForeignKey
ALTER TABLE "FileSystem" DROP CONSTRAINT "FileSystem_parentId_fkey";

-- DropTable
DROP TABLE "FileSystem";

-- DropEnum
DROP TYPE "FileType";

-- CreateTable
CREATE TABLE "FileSystemNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "parentId" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystemNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileSystemNode" ADD CONSTRAINT "FileSystemNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileSystemNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
