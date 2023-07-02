/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `dni` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_dni_key` ON `Student`(`dni`);
