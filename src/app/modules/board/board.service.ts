import { Board, BoardMember } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from './board.utils';

const insertIntoDB = async (
  payload: Board,
  user: JwtPayload
): Promise<Board> => {
  await BoardUtils.checkAdminExistInWorkspace(
    user?.userId,
    payload?.workspaceId
  );

  payload.admin = user?.userId;

  const result = await prisma.board.create({
    data: payload,
  });
  return result;
};

const addBoardMembers = async (id: string, payload: any, user: JwtPayload) => {
  try {
    const isAdmin = await prisma.board.findUnique({
      where: {
        id,
        admin: user?.userId,
      },
    });

    const isMember = await prisma.boardMember.findFirst({
      where: {
        userId: user?.userId,
        boardId: id,
      },
    });

    if (!isAdmin && !isMember) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
    }

    for (let index = 0; index < payload.members.length; index++) {
      await prisma.boardMember.create({
        data: {
          boardId: id,
          userId: payload.members[index],
        },
      });
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Added');
  }
};

const removeBoardMember = async (
  id: string,
  payload: any,
  user: JwtPayload
) => {
  await BoardUtils.checkAdminExistInBoard(id, user?.userId);
  await prisma.boardMember.deleteMany({
    where: {
      boardId: id,
      userId: payload.memberId as string,
    },
  });
};

const getAllBoardsOfMember = async (
  user: JwtPayload
): Promise<BoardMember[]> => {
  const result = await prisma.boardMember.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      board: {
        include: {
          workspace: true,
        },
      },
    },
  });
  return result;
};

export const BoardService = {
  insertIntoDB,
  addBoardMembers,
  removeBoardMember,
  getAllBoardsOfMember,
};