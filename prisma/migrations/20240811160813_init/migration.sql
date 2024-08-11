/*
  Warnings:

  - The values [Primero,Segundo,Tercero,Cuarto,Quinto,Sexto] on the enum `level` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `grade` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "grade" AS ENUM ('Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto');

-- AlterEnum
BEGIN;
CREATE TYPE "level_new" AS ENUM ('Inicial', 'Primaria', 'Secundaria');
ALTER TABLE "Grade" ALTER COLUMN "level" TYPE "level_new" USING ("level"::text::"level_new");
ALTER TYPE "level" RENAME TO "level_old";
ALTER TYPE "level_new" RENAME TO "level";
DROP TYPE "level_old";
COMMIT;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "grade" "grade" NOT NULL;
