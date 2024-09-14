import { BoardTemplate } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createTemplate = async (
  user: JwtPayload,
  boardId: string,
  templateTitle: string
) => {
  try {
    // Fetch the board along with its lists and cards
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        Lists: {
          include: {
            Cards: {
              include: {
                Checklists: {
                  include: {
                    ChecklistItems: true,
                  },
                },
              },
            }, // Include cards within each list
          },
        },
      },
    });

    if (!board) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Board not found');
    }

    // Begin transaction to ensure atomic operations
    const result = await prisma.$transaction(async prisma => {
      // Create a BoardTemplate entry
      const createdTemplate = await prisma.boardTemplate.create({
        data: {
          title: board?.title,
          templateTitle,
          themeId: board?.themeId,
          userId: user?.userId,
        },
      });

      // For each list in the board, create a TemplateList and associated TemplateCards
      for (const list of board.Lists) {
        // Create TemplateList from each board's list
        const createdTemplateList = await prisma.listTemplate.create({
          data: {
            title: list.title,
            boardTemplateId: createdTemplate.id,
          },
        });

        // For each card in the list, create a TemplateCard
        for (const card of list.Cards) {
          const createdTemplateCard = await prisma.cardTemplate.create({
            data: {
              title: card.title,
              description: card.description,
              listId: createdTemplateList.id,
            },
          });
          for (const checklist of card?.Checklists) {
            const createdTemplateChecklist =
              await prisma.checklistTemplate.create({
                data: {
                  title: checklist.title,
                  cardId: createdTemplateCard.id,
                },
              });
            for (const item of checklist?.ChecklistItems) {
              await prisma.checklistItemTemplate.create({
                data: {
                  title: item.title,
                  checklistId: createdTemplateChecklist.id,
                },
              });
            }
          }
        }
      }

      return createdTemplate;
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create template from board'
    );
  }
};

const getAllTemplatesOfSingleUser = async (
  user: JwtPayload
): Promise<BoardTemplate[]> => {
  const result = await prisma.boardTemplate.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      theme: true,
    },
  });
  return result;
};

export const TemplateService = {
  createTemplate,
  getAllTemplatesOfSingleUser,
};
