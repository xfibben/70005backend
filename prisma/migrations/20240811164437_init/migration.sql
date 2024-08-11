/*
  Warnings:

  - A unique constraint covering the columns `[gradeId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_contestId_fkey";

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "contestId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Test_gradeId_key" ON "Test"("gradeId");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
