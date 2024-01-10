/*
  Warnings:

  - You are about to drop the column `privacy` on the `boards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boards" DROP COLUMN "privacy";

-- DropEnum
DROP TYPE "BoardPrivacy";
