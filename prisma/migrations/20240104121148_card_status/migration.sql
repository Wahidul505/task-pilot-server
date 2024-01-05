-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('pending', 'done', 'overdue');

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "status" "CardStatus";
