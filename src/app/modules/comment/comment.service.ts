import { CardComment } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { CardUtils } from '../card/card.utils';

const addComment = async (
  payload: CardComment,
  user: JwtPayload
): Promise<CardComment> => {
  const card = await prisma.card.findUnique({
    where: {
      id: payload?.cardId,
    },
  });

  if (!card) throw new ApiError(httpStatus.BAD_REQUEST, 'Card not found');
  await CardUtils.checkEitherAdminOrMemberInBoard(card?.listId, user?.userId);

  const result = await prisma.cardComment.create({
    data: payload,
  });
  return result;
};

export const CommentService = {
  addComment,
};
