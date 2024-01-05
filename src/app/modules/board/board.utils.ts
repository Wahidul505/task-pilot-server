import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const checkAdminExistInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const adminExist = await prisma.workspaceAdmin.findFirst({
    where: {
      workspaceId: workspaceId,
      userId: userId,
    },
  });

  if (!adminExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
  }
};

const checkAdminExistInBoard = async (boardId: string, userId: string) => {
  const adminExist = await prisma.board.findFirst({
    where: {
      id: boardId,
      admin: userId,
    },
  });
  if (!adminExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
  }
};

export const BoardUtils = {
  checkAdminExistInWorkspace,
  checkAdminExistInBoard,
};
