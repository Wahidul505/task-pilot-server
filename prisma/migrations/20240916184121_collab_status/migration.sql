-- CreateEnum
CREATE TYPE "CollabStatus" AS ENUM ('pending', 'accept');

-- AlterTable
ALTER TABLE "CollabQueue" ADD COLUMN     "status" "CollabStatus" NOT NULL DEFAULT 'pending';
