import { ChecklistItem } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const createChecklistItem = async (
  payload: ChecklistItem,
  user: JwtPayload
): Promise<ChecklistItem> => {
  const checklist = await prisma.checklist.findUnique({
    where: {
      id: payload?.checklistId,
    },
  });
  if (!checklist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Checklist not found');
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
  await BoardUtils.checkEitherAdminOrMemberInBoard(list?.boardId, user?.userId);

  const result = await prisma.checklistItem.create({
    data: payload,
  });
  return result;
};

export const ChecklistItemService = {
  createChecklistItem,
};
