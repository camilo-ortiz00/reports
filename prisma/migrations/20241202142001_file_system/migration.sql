-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('FOLDER', 'FILE');

-- CreateTable
CREATE TABLE "FileSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "parentId" INTEGER,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileSystem" ADD CONSTRAINT "FileSystem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileSystem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
