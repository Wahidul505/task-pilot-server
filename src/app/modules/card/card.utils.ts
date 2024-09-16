import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const checkEitherAdminOrMemberInBoard = async (
  listId: string,
  userId: string
) => {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });
  if (list) {
    await BoardUtils.checkEitherAdminOrMemberInBoard({
      boardId: list?.boardId,
      userId: userId,
      access: 'editor',
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "List doesn't exist");
  }
};

export const CardUtils = {
  checkEitherAdminOrMemberInBoard,
};
