/*
  Warnings:

  - You are about to drop the column `dni` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documento]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Student_dni_key` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `dni`,
    ADD COLUMN `documento` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Student_documento_key` ON `Student`(`documento`);
