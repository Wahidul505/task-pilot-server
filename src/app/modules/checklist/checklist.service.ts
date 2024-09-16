import { Checklist } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const createChecklist = async (
  payload: Checklist,
  user: JwtPayload
): Promise<Checklist> => {
  const card = await prisma.card.findUnique({
    where: {
      id: payload?.cardId,
    },
  });
  if (!card) throw new ApiError(httpStatus.BAD_REQUEST, 'Card not found');
  const list = await prisma.list.findUnique({
    where: {
      id: card?.listId,
    },
  });
  if (!list) throw new ApiError(httpStatus.BAD_REQUEST, 'List not found');
  await BoardUtils.checkEitherAdminOrMemberInBoard({
    boardId: list?.boardId,
    userId: user?.userId,
    access: 'editor',
  });

  const result = await prisma.checklist.create({
    data: payload,
  });
  return result;
};

const updateChecklistTitle = async (
  id: string,
  payload: { title: string },
  user: JwtPayload
): Promise<Checklist> => {
  const checklist = await prisma.checklist.findUnique({
    where: {
      id,
    },
    include: {
      card: true,
    },
  });
  const card = await prisma.card.findUnique({
    where: {
      id: checklist?.cardId,
    },
  });
  if (!card) throw new ApiError(httpStatus.BAD_REQUEST, 'Card not found');
  const list = await prisma.list.findUnique({
    where: {
      id: card?.listId,
    },
  });
  if (!list) throw new ApiError(httpStatus.BAD_REQUEST, 'List not found');
  await BoardUtils.checkEitherAdminOrMemberInBoard({
    boardId: list?.boardId,
    userId: user?.userId,
    access: 'editor',
  });

  const result = await prisma.checklist.update({
    where: {
      id,
    },
    data: { title: payload?.title },
  });
  return result;
};

const getAllChecklist = async (cardId: string): Promise<Checklist[]> => {
  const result = await prisma.checklist.findMany({
    where: {
      cardId,
    },
    include: {
      ChecklistItems: {
        include: {
          checklist: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return result;
};

const deleteSingleChecklist = async (
  id: string,
  user: JwtPayload
): Promise<Checklist | null> => {
  // Find the checklist to ensure it exists and to get related data
  const checklist = await prisma.checklist.findUnique({
    where: {
      id,
    },
    include: {
      card: {
        include: {
          list: true,
        },
      },
    },
  });

  if (!checklist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Checklist not found');

  // Check if the user is either an admin or a member of the board
  await BoardUtils.checkEitherAdminOrMemberInBoard({
    boardId: checklist.card.list.boardId,
    userId: user?.userId,
    access: 'editor',
  });

  // Start a transaction to delete checklist and its related items atomically
  const result = await prisma.$transaction(async prisma => {
    // Delete related checklist items
    await prisma.checklistItem.deleteMany({
      where: {
        checklistId: id,
      },
    });

    // Delete the checklist itself
    const deletedChecklist = await prisma.checklist.delete({
      where: {
        id,
      },
    });

    return deletedChecklist;
  });

  return result;
};

export const ChecklistService = {
  createChecklist,
  updateChecklistTitle,
  getAllChecklist,
  deleteSingleChecklist,
};
