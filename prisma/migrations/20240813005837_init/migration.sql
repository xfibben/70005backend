/*
  Warnings:

  - You are about to drop the column `gradeId` on the `School` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_gradeId_fkey";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "gradeId";
