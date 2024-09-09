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

    for (let index = 0; index < members.length; index++) {
      await prisma.boardMember.create({
        data: {
          boardId: id,
          userId: members[index],
        },
      });
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
  const result = await prisma.$transaction(async prisma => {
    // Remove the board member from all cards within the board
    await prisma.cardMember.deleteMany({
      where: {
        userId: payload.memberId as string,
        card: {
          list: {
            boardId: id,
          },
        },
      },
    });

    // Remove the board member from the board
    await prisma.boardMember.deleteMany({
      where: {
        boardId: id,
        userId: payload.memberId as string,
      },
    });
    return payload;
  });
  return result;
};

const leaveBoard = async (id: string, user: JwtPayload) => {
  console.log({ id });
  console.log({ user: user?.userId });
  await BoardUtils.checkEitherAdminOrMemberInBoard(id, user?.userId);
  await prisma.boardMember.deleteMany({
    where: {
      boardId: id,
      userId: user?.userId,
    },
  });
  return user;
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

const getAllBoardsOfSingleWorkspace = async (
  workspaceId: string,
  user: JwtPayload
): Promise<Board[]> => {
  const result = await prisma.board.findMany({
    where: {
      workspaceId,
      OR: [
        {
          BoardMembers: {
            some: {
              userId: user?.userId,
            },
          },
        },
        {
          admin: user?.userId,
        },
      ],
    },
    include: {
      template: true,
      workspace: {
        include: {
          WorkspaceAdmins: {
            include: {
              user: true,
            },
          },
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
      Lists: true,
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

const deleteSingleBoard = async (
  id: string,
  user: JwtPayload
): Promise<Board | null> => {
  // Check if the user is an admin of the board
  await BoardUtils.checkAdminExistInBoard(id, user?.userId);

  try {
    // Start a transaction to ensure all deletions happen atomically
    const result = await prisma.$transaction(async prisma => {
      // Delete related CardMembers
      await prisma.cardMember.deleteMany({
        where: {
          card: {
            list: {
              boardId: id,
            },
          },
        },
      });

      // Delete related CardComments
      await prisma.cardComment.deleteMany({
        where: {
          card: {
            list: {
              boardId: id,
            },
          },
        },
      });

      // Delete related ChecklistItems
      await prisma.checklistItem.deleteMany({
        where: {
          checklist: {
            card: {
              list: {
                boardId: id,
              },
            },
          },
        },
      });

      // Delete related Checklists
      await prisma.checklist.deleteMany({
        where: {
          card: {
            list: {
              boardId: id,
            },
          },
        },
      });

      // Delete related Cards
      await prisma.card.deleteMany({
        where: {
          list: {
            boardId: id,
          },
        },
      });

      // Delete related Lists
      await prisma.list.deleteMany({
        where: {
          boardId: id,
        },
      });

      // Delete related BoardMembers
      await prisma.boardMember.deleteMany({
        where: {
          boardId: id,
        },
      });

      // Finally, delete the Board itself
      const deletedBoard = await prisma.board.delete({
        where: {
          id: id,
        },
      });

      return deletedBoard;
    });

    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete board'
    );
  }
};

export const BoardService = {
  insertIntoDB,
  addBoardMembers,
  removeBoardMember,
  leaveBoard,
  getAllBoardsOfMember,
  getSingleData,
  updateBoardTitle,
  getAllBoardsOfSingleWorkspace,
  deleteSingleBoard,
};
