/*
  Warnings:

  - You are about to drop the column `contestId` on the `Inscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_contestId_fkey";

-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "contestId",
ADD COLUMN     "testId" INTEGER;
