/*
  Warnings:

  - The values [Inicial,Primaria,Secundaria] on the enum `level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `grade` on the `Grade` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "level_new" AS ENUM ('Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto');
ALTER TABLE "Grade" ALTER COLUMN "level" TYPE "level_new" USING ("level"::text::"level_new");
ALTER TYPE "level" RENAME TO "level_old";
ALTER TYPE "level_new" RENAME TO "level";
DROP TYPE "level_old";
COMMIT;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "grade";
