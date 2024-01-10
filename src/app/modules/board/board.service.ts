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
    await BoardUtils.checkEitherAdminOrMemberInBoard(id, user?.userId);

    const members = payload?.members?.filter(
      (member: string) => member !== user?.userId
    );

    console.log({ members });

    for (let index = 0; index < members.length; index++) {
      const result = await prisma.boardMember.create({
        data: {
          boardId: id,
          userId: members[index],
        },
      });
      console.log({ result });
    }
    return payload;
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
  return payload;
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

const getSingleData = async (
  id: string,
  user: JwtPayload
): Promise<Board | null> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(id, user?.userId);
  const result = await prisma.board.findUnique({
    where: {
      id,
    },
    include: {
      workspace: {
        include: {
          Boards: {
            include: {
              template: true,
            },
          },
        },
      },
      BoardMembers: {
        include: {
          user: true,
        },
      },
      user: true,
      template: true,
    },
  });
  return result;
};

const updateBoardTitle = async (
  id: string,
  payload: { title: string },
  user: JwtPayload
): Promise<Board> => {
  await BoardUtils.checkAdminExistInBoard(id, user?.userId);
  const result = await prisma.board.update({
    where: {
      id,
    },
    data: { title: payload?.title },
  });
  return result;
};

export const BoardService = {
  insertIntoDB,
  addBoardMembers,
  removeBoardMember,
  getAllBoardsOfMember,
  getSingleData,
  updateBoardTitle,
};
