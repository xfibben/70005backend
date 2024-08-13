/*
  Warnings:

  - The values [Inicial,Primaria,Secundaria] on the enum `level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "grade" ADD VALUE 'INICIAL';

-- AlterEnum
BEGIN;
CREATE TYPE "level_new" AS ENUM ('INICIAL', 'PRIMARIA', 'SECUNDARIA');
ALTER TABLE "Grade" ALTER COLUMN "level" TYPE "level_new" USING ("level"::text::"level_new");
ALTER TYPE "level" RENAME TO "level_old";
ALTER TYPE "level_new" RENAME TO "level";
DROP TYPE "level_old";
COMMIT;
