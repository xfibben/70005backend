-- DropIndex
DROP INDEX "Student_dni_key";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "dni" DROP NOT NULL;
