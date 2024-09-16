/*
  Warnings:

  - You are about to drop the column `access` on the `board_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "board_members" DROP COLUMN "access";

-- DropEnum
DROP TYPE "BoardMemberAccess";
