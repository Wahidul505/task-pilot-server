-- CreateTable
CREATE TABLE "checklist_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "checklist_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_item_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,

    CONSTRAINT "checklist_item_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklist_templates" ADD CONSTRAINT "checklist_templates_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_item_templates" ADD CONSTRAINT "checklist_item_templates_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklist_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
