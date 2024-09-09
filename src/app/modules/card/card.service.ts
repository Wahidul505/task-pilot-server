import { Card } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';
import { CardUtils } from './card.utils';

const createCard = async (payload: Card, user: JwtPayload): Promise<Card> => {
  await CardUtils.checkEitherAdminOrMemberInBoard(
    payload?.listId,
    user?.userId
  );
  const result = await prisma.card.create({
    data: payload,
  });
  return result;
};

const getAllCards = async (
  listId: string,
  user: JwtPayload
): Promise<Card[]> => {
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
  await CardUtils.checkEitherAdminOrMemberInBoard(
    payload?.listId,
    user?.userId
  );
  const result = await prisma.card.update({
    where: {
      id,
    },
    data: { listId: payload?.listId },
  });
  return result;
};

const addCardMember = async (
  id: string,
  payload: { memberId: string },
  user: JwtPayload
) => {
  try {
    const board = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!board)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Board is not found');

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      user?.userId
    );

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      payload?.memberId
    );

    await prisma.cardMember.create({
      data: {
        cardId: id,
        userId: payload?.memberId,
      },
    });

    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Added');
  }
};

const removeCardMember = async (
  id: string,
  payload: { memberId: string },
  user: JwtPayload
) => {
  try {
    const board = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!board)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Board is not found');

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      user?.userId
    );

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      payload?.memberId
    );

    await prisma.cardMember.deleteMany({
      where: {
        cardId: id,
        userId: payload?.memberId,
      },
    });

    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already removed');
  }
};

const updateSingleCard = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    dueDate?: Date;
    status: 'pending' | 'done';
  },
  user: JwtPayload
) => {
  try {
    const board = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!board)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Board is not found');

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      user?.userId
    );

    const result = await prisma.card.update({
      where: {
        id,
      },
      data: payload,
    });

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
  }
};

const removeSingleCard = async (id: string, user: JwtPayload) => {
  try {
    const board = await prisma.card.findUnique({
      where: {
        id,
      },
      include: {
        list: true,
      },
    });

    if (!board)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Board is not found');

    await BoardUtils.checkEitherAdminOrMemberInBoard(
      board?.list?.boardId,
      user?.userId
    );

    await prisma.checklist.deleteMany({
      where: {
        cardId: id,
      },
    });
    await prisma.cardMember.deleteMany({
      where: {
        cardId: id,
      },
    });
    await prisma.cardComment.deleteMany({
      where: {
        cardId: id,
      },
    });

    const result = await prisma.card.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something Went Wronggg');
  }
};

export const CardService = {
  createCard,
  getAllCards,
  updateListId,
  addCardMember,
  removeCardMember,
  updateSingleCard,
  removeSingleCard,
};
