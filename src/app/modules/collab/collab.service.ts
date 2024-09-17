import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { BoardUtils } from '../board/board.utils';

const collabRequest = async (
  board1Id: string,
  board2Id: string,
  user: JwtPayload
) => {
  // Check if the user is an admin of the board
  await BoardUtils.checkAdminExistInBoard(board1Id, user?.userId);

  let result;

  const board1 = await prisma.board.findFirst({
    where: { id: board1Id },
  });

  const board2 = await prisma.board.findFirst({
    where: { id: board2Id },
    include: { user: true },
  });

  if (!board1 || !board2) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'One or both boards do not exist'
    );
  }

  // Check if the board already has a collabId
  if (!board1.collabId) {
    // Create a new collaboration record
    const newCollab = await prisma.boardCollab.create({
      data: {},
    });

    // Update the board with the new collaboration ID
    await prisma.board.update({
      where: { id: board1Id },
      data: {
        collabId: newCollab.id,
      },
    });

    result = await prisma.collabQueue.create({
      data: {
        boardId: board2Id,
        collabId: newCollab.id,
        adminId: user?.userId,
      },
    });
  } else if (board1?.collabId) {
    const existCollab = await prisma.boardCollab.findFirst({
      where: { id: board1?.collabId },
      include: { Boards: true },
    });

    if (existCollab && existCollab?.Boards?.length > 1) {
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Collab limit exceeded');
    }

    const existQueue = await prisma.collabQueue.findFirst({
      where: { boardId: board2Id },
    });

    if (existQueue) {
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Already requested');
    }

    result = await prisma.collabQueue.create({
      data: {
        boardId: board2Id,
        collabId: board1?.collabId,
        adminId: user?.userId,
      },
    });
  }
  return result;
};

const collabAction = async (
  board2Id: string,
  collabQueueId: string,
  user: JwtPayload,
  status: 'accept' | 'decline'
) => {
  // Check if the current user is the admin of board 2

  await BoardUtils.checkAdminExistInBoard(board2Id, user?.userId);

  // Find the collab queue request
  const collabRequest = await prisma.collabQueue.findFirst({
    where: { id: collabQueueId, boardId: board2Id },
    include: { boardCollab: { include: { Boards: true } } },
  });

  if (!collabRequest) {
    throw new Error('Collaboration request not found');
  }

  const board1 = await prisma.board.findFirst({
    where: {
      collabId: collabRequest?.boardCollab?.id,
    },
    include: { BoardMembers: true },
  });

  if (status === 'decline') {
    await prisma.collabQueue.delete({
      where: { id: collabQueueId },
    });
    return;
  } else if (status === 'accept') {
    if (
      collabRequest?.boardCollab &&
      collabRequest?.boardCollab?.Boards?.length > 1
    ) {
      throw new ApiError(httpStatus.BAD_GATEWAY, 'Collab limit exceeded');
    }

    await prisma.board.update({
      where: { id: board2Id },
      data: { collabId: collabRequest.collabId },
    });

    await prisma.collabQueue.update({
      where: { id: collabQueueId },
      data: { status: 'accept' },
    });

    // start
    const board2 = await prisma.board.findFirst({
      where: { id: board2Id },
      include: { BoardMembers: true },
    });

    if (!board1 || !board2) {
      throw new ApiError(httpStatus.NOT_FOUND, 'One or both boards not found');
    }

    const board2Members = board2.BoardMembers.map(member => member.userId);
    const board2Admin = board2.admin;

    // Add members of board1 to board2
    for (const member of board1.BoardMembers) {
      // If member is not already an admin or member in board2
      if (
        !board2Members.includes(member.userId) &&
        member.userId !== board2Admin
      ) {
        await prisma.boardMember.create({
          data: {
            boardId: board2Id,
            userId: member.userId,
          },
        });
      }
    }

    // Add admin of board1 to board2, if they are not already a member or admin
    if (!board2Members.includes(board1.admin) && board1.admin !== board2Admin) {
      await prisma.boardMember.create({
        data: {
          boardId: board2Id,
          userId: board1.admin,
        },
      });
    }

    // Get board1's members and admin
    const board1Members = board1.BoardMembers.map(member => member.userId);
    const board1Admin = board1.admin;

    // Add members of board2 to board1
    for (const member of board2.BoardMembers) {
      // If member is not already an admin or member in board1
      if (
        !board1Members.includes(member.userId) &&
        member.userId !== board1Admin
      ) {
        await prisma.boardMember.create({
          data: {
            boardId: board1.id,
            userId: member.userId,
          },
        });
      }
    }

    // Add admin of board2 to board1, if they are not already a member or admin
    if (!board1Members.includes(board2Admin) && board2Admin !== board1Admin) {
      await prisma.boardMember.create({
        data: {
          boardId: board1.id,
          userId: board2Admin,
        },
      });
    }
    // end
  }

  return {
    message: `collab request ${status === 'accept' ? 'accepted' : 'declined'}`,
  };
};

const getUserReceivedCollabRequests = async (user: JwtPayload) => {
  // Fetch boards where the user is an admin
  const userBoards = await prisma.board.findMany({
    where: {
      admin: user?.userId,
    },
    select: {
      id: true, // Get only the board ID
    },
  });

  const boardIds = userBoards.map(board => board.id);

  if (!boardIds.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No boards found for the user');
  }

  // Fetch collaboration requests where the boardId is in the user's boards
  const collabRequests = await prisma.collabQueue.findMany({
    where: {
      boardId: {
        in: boardIds,
      },
      status: 'pending', // Only get pending requests
    },
    include: {
      board: {
        include: {
          workspace: true,
        },
      }, // Include board details
      boardCollab: {
        include: {
          Boards: true, // Include all boards involved in the collaboration
        },
      },
      admin: {
        select: {
          id: true,
          name: true,
          email: true, // Include details of the requesting admin
        },
      },
    },
  });

  if (!collabRequests.length) {
    return {};
  }

  return collabRequests;
};

const getSingleCollab = async (id: string) => {
  const result = await prisma.boardCollab.findFirst({
    where: { id },
    include: { Boards: true },
  });
  const result2 = await prisma.collabQueue.findMany();
  return result2;
};

export const CollabService = {
  collabRequest,
  collabAction,
  getSingleCollab,
  getUserReceivedCollabRequests,
};
