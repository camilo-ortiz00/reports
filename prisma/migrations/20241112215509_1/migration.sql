/*
  Warnings:

  - You are about to drop the column `component_id` on the `User` table. All the data in the column will be lost.
  - Made the column `user_id` on table `Component` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_component_id_fkey";

-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "component_id";

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
