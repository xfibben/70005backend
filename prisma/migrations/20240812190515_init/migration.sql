-- AlterTable
ALTER TABLE "Qualification" ADD COLUMN     "endingTime" TEXT,
ADD COLUMN     "startingTime" TEXT,
ALTER COLUMN "time" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "time" SET DATA TYPE TEXT;
