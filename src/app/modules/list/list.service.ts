import { List } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const createList = async (payload: List, user: JwtPayload): Promise<List> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(
    payload?.boardId,
    user?.userId
  );
  const result = await prisma.list.create({
    data: payload,
  });
  return result;
};

const getAllLists = async (
  boardId: string,
  user: JwtPayload
): Promise<List[]> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(boardId, user?.userId);
  const result = await prisma.list.findMany({
    where: {
      boardId: boardId,
    },
    include: {
      Cards: {
        include: {
          list: {
            include: {
              board: {
                include: {
                  BoardMembers: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          CardMembers: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return result;
};

const getSingleList = async (
  id: string,
  user: JwtPayload
): Promise<List | null> => {
  const result = await prisma.list.findUnique({
    where: {
      id,
    },
  });
  if (result)
    await BoardUtils.checkEitherAdminOrMemberInBoard(
      result?.boardId,
      user?.userId
    );
  return result;
};

const updateListTitle = async (
  id: string,
  payload: { title: string; boardId: string },
  user: JwtPayload
): Promise<List> => {
  await BoardUtils.checkEitherAdminOrMemberInBoard(
    payload?.boardId,
    user?.userId
  );
  const result = await prisma.list.update({
    where: {
      id,
    },
    data: { title: payload?.title },
  });
  return result;
};

const deleteSingleList = async (
  id: string,
  user: JwtPayload
): Promise<List> => {
  console.log({ id });
  console.log({ user });
  const result = await prisma.list.delete({
    where: {
      id,
      board: {
        admin: user?.userId,
      },
    },
  });
  return result;
};

export const ListService = {
  createList,
  getSingleList,
  getAllLists,
  updateListTitle,
  deleteSingleList,
};
