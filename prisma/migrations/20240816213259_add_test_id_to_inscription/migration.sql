/*
  Warnings:

  - Made the column `testId` on table `Inscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "testId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
