/*
  Warnings:

  - The primary key for the `board_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `board_members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,boardId]` on the table `board_members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "board_members" DROP CONSTRAINT "board_members_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "board_members_userId_boardId_key" ON "board_members"("userId", "boardId");
