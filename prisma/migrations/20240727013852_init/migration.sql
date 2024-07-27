-- CreateEnum
CREATE TYPE "type" AS ENUM ('Privada', 'Publica');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "type" "type";
