-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "collabId" TEXT;

-- CreateTable
CREATE TABLE "BoardCollab" (
    "id" TEXT NOT NULL,

    CONSTRAINT "BoardCollab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabQueue" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "collabId" TEXT NOT NULL,

    CONSTRAINT "CollabQueue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "BoardCollab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabQueue" ADD CONSTRAINT "CollabQueue_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabQueue" ADD CONSTRAINT "CollabQueue_collabId_fkey" FOREIGN KEY ("collabId") REFERENCES "BoardCollab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
