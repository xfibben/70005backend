/*
  Warnings:

  - The values [Primero,Segundo,Tercero,Cuarto,Quinto,Sexto] on the enum `grade` will be removed. If these variants are still used in the database, this will fail.
  - The values [Privada,Publica] on the enum `type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `owned` on the `Student` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "mode" AS ENUM ('INDEPENDIENTE', 'DELEGACION', 'INTERNO');

-- AlterEnum
BEGIN;
CREATE TYPE "grade_new" AS ENUM ('PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO');
ALTER TABLE "Grade" ALTER COLUMN "grade" TYPE "grade_new" USING ("grade"::text::"grade_new");
ALTER TYPE "grade" RENAME TO "grade_old";
ALTER TYPE "grade_new" RENAME TO "grade";
DROP TYPE "grade_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "type_new" AS ENUM ('PRIVADA', 'PUBLICA');
ALTER TABLE "School" ALTER COLUMN "type" TYPE "type_new" USING ("type"::text::"type_new");
ALTER TYPE "type" RENAME TO "type_old";
ALTER TYPE "type_new" RENAME TO "type";
DROP TYPE "type_old";
COMMIT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "owned",
ADD COLUMN     "mode" "mode";
