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

const checkEitherAdminOrMemberInBoard = async ({
  boardId,
  userId,
  access = 'read_only',
}: {
  boardId: string;
  userId: string;
  access?: 'editor' | 'read_only';
}) => {
  const isAdmin = await prisma.board.findUnique({
    where: {
      id: boardId,
      admin: userId,
    },
  });

  const isEditor = await prisma.boardMember.findFirst({
    where: {
      userId: userId,
      boardId: boardId,
      access: 'editor',
    },
  });

  const isReadOnly = await prisma.boardMember.findFirst({
    where: {
      userId: userId,
      boardId: boardId,
    },
  });

  if (access === 'editor' && !isAdmin && !isEditor) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
  } else if (!isAdmin && !isReadOnly) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
  }
};

export const BoardUtils = {
  checkAdminExistInWorkspace,
  checkAdminExistInBoard,
  checkEitherAdminOrMemberInBoard,
};
