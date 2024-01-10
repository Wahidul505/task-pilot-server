import { Card } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const createCard = async (payload: Card, user: JwtPayload): Promise<Card> => {
  const list = await prisma.list.findUnique({
    where: {
      id: payload?.listId,
    },
  });
  if (list) {
    await BoardUtils.checkEitherAdminOrMemberInBoard(
      list?.boardId,
      user?.userId
    );
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "List doesn't exist");
  }
  const result = await prisma.card.create({
    data: payload,
  });
  return result;
};

const getAllCards = async (
  listId: string,
  user: JwtPayload
): Promise<Card[]> => {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });
  if (list) {
    await BoardUtils.checkEitherAdminOrMemberInBoard(
      list?.boardId,
      user?.userId
    );
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "List doesn't exist");
  }
  const result = await prisma.card.findMany({
    where: {
      listId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return result;
};

const updateListId = async (
  id: string,
  payload: { listId: string },
  user: JwtPayload
): Promise<Card> => {
  const list = await prisma.list.findUnique({
    where: {
      id: payload?.listId,
    },
  });
  if (list) {
    await BoardUtils.checkEitherAdminOrMemberInBoard(
      list?.boardId,
      user?.userId
    );
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "List doesn't exist");
  }
  const result = await prisma.card.update({
    where: {
      id,
    },
    data: { listId: payload?.listId },
  });
  return result;
};

export const CardService = {
  createCard,
  getAllCards,
  updateListId,
};
