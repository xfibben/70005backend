/*
  Warnings:

  - You are about to drop the column `grade` on the `Qualification` table. All the data in the column will be lost.
  - Added the required column `gradeId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `schoolId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `gradeId` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "level" AS ENUM ('Inicial', 'Primaria', 'Secundaria');

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- AlterTable
ALTER TABLE "Qualification" DROP COLUMN "grade";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "gradeId" INTEGER NOT NULL,
ALTER COLUMN "schoolId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "gradeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "level" "level" NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
