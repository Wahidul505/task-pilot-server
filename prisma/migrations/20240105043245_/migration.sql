/*
  Warnings:

  - The primary key for the `card_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `card_members` table. All the data in the column will be lost.
  - The primary key for the `workspace_admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `workspace_admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "card_members" DROP CONSTRAINT "card_members_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "workspace_admins" DROP CONSTRAINT "workspace_admins_pkey",
DROP COLUMN "id";
