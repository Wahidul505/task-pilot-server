-- CreateEnum
CREATE TYPE "BoardMemberAccess" AS ENUM ('editor', 'read_only');

-- AlterTable
ALTER TABLE "board_members" ADD COLUMN     "access" "BoardMemberAccess" NOT NULL DEFAULT 'editor';
