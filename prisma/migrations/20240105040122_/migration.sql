/*
  Warnings:

  - A unique constraint covering the columns `[userId,cardId]` on the table `card_members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,workspaceId]` on the table `workspace_admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "card_members_userId_cardId_key" ON "card_members"("userId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_admins_userId_workspaceId_key" ON "workspace_admins"("userId", "workspaceId");
