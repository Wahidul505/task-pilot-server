import { List } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const createList = async (payload: List, user: JwtPayload): Promise<List> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(
    payload?.boardId,
    user?.userId
  );
  const result = await prisma.list.create({
    data: payload,
  });
  return result;
};

const getAllLists = async (
  boardId: string,
  user: JwtPayload
): Promise<List[]> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(boardId, user?.userId);
  const result = await prisma.list.findMany({
    where: {
      boardId: boardId,
    },
    include: {
      Cards: {
        include: {
          list: {
            include: {
              board: {
                include: {
                  BoardMembers: {
                    include: {
                      user: true,
                    },
                  },
                  user: true,
                },
              },
            },
          },
          CardMembers: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return result;
};

const getSingleList = async (
  id: string,
  user: JwtPayload
): Promise<List | null> => {
  const result = await prisma.list.findUnique({
    where: {
      id,
    },
  });
  if (result)
    await BoardUtils.checkEitherAdminOrMemberInBoard(
      result?.boardId,
      user?.userId
    );
  return result;
};

const updateListTitle = async (
  id: string,
  payload: { title: string; boardId: string },
  user: JwtPayload
): Promise<List> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(
    payload?.boardId,
    user?.userId
  );
  const result = await prisma.list.update({
    where: {
      id,
    },
    data: { title: payload?.title },
  });
  return result;
};

const deleteSingleList = async (
  id: string,
  user: JwtPayload
): Promise<List> => {
  // Find the list to ensure it exists and retrieve related data
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      board: true,
      Cards: {
        include: {
          Checklists: {
            include: {
              ChecklistItems: true,
            },
          },
          CardMembers: true,
          CardComments: true,
        },
      },
    },
  });

  if (!list) throw new ApiError(httpStatus.BAD_REQUEST, 'List not found');

  // Check if the user is either an admin or a member of the board
  await BoardUtils.checkEitherAdminOrMemberInBoard(list.boardId, user?.userId);

  // Start a transaction to delete the list and its dependencies atomically
  const result = await prisma.$transaction(async prisma => {
    // Delete checklist items
    for (const card of list.Cards) {
      for (const checklist of card.Checklists) {
        await prisma.checklistItem.deleteMany({
          where: { checklistId: checklist.id },
        });
      }
    }

    // Delete checklists
    for (const card of list.Cards) {
      await prisma.checklist.deleteMany({
        where: { cardId: card.id },
      });
    }

    // Delete card members
    for (const card of list.Cards) {
      await prisma.cardMember.deleteMany({
        where: { cardId: card.id },
      });
    }

    // Delete card comments
    for (const card of list.Cards) {
      await prisma.cardComment.deleteMany({
        where: { cardId: card.id },
      });
    }

    // Delete cards
    await prisma.card.deleteMany({
      where: { listId: id },
    });

    // Finally, delete the list itself
    const deletedList = await prisma.list.delete({
      where: { id },
    });

    return deletedList;
  });

  return result;
};

export const ListService = {
  createList,
  getSingleList,
  getAllLists,
  updateListTitle,
  deleteSingleList,
};
