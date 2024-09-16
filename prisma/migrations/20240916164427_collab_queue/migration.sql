/*
  Warnings:

  - Added the required column `adminId` to the `CollabQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CollabQueue" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CollabQueue" ADD CONSTRAINT "CollabQueue_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
