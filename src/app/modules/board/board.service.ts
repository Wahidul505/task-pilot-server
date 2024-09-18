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
const getAllBoardsOfAdmin = async (userEmail: string): Promise<Board[]> => {
  // Find the user based on their email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Fetch all boards where the user is the admin
  const result = await prisma.board.findMany({
    where: {
      admin: user.id,
    },
    include: {
      workspace: true, // Include workspace details if needed
      theme: true, // Include theme if you want additional board-related data
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
      theme: true,
      boardCollab: {
        include: {
          Boards: {
            where: {
              workspaceId: {
                notIn: [workspaceId],
              },
            },
            include: {
              theme: true,
            },
            orderBy: {
              createdAt: 'asc', // You can change to 'desc' for descending order
            },
          },
        },
      },
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
    orderBy: {
      createdAt: 'asc', // You can change to 'desc' for descending order
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
              theme: true,
            },
          },
          WorkspaceAdmins: true,
        },
      },
      BoardMembers: {
        include: {
          user: true,
        },
      },
      user: true,
      theme: true,
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

// Service to create a new board based on a template
const createBoardFromTemplate = async (
  user: JwtPayload,
  templateId: string,
  workspaceId: string
) => {
  try {
    // Fetch the template along with its lists and cards
    const template = await prisma.boardTemplate.findUnique({
      where: { id: templateId },
      include: {
        Lists: {
          include: {
            Cards: {
              include: {
                Checklists: {
                  include: {
                    ChecklistItems: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!template) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
    }

    // Start a transaction to ensure atomic operations
    const result = await prisma.$transaction(async prisma => {
      // Create a new board using the template's details
      const newBoard = await prisma.board.create({
        data: {
          title: template?.title, // Title of the new board
          admin: user?.userId, // User who is creating the board
          workspaceId, // Associate with the provided workspace
          themeId: template?.themeId, // Reference to the template
        },
      });

      // Loop through each list in the template and create them in the new board
      for (const templateList of template.Lists) {
        const newList = await prisma.list.create({
          data: {
            title: templateList.title, // Same title as the template list
            boardId: newBoard.id, // Associate with the new board
          },
        });

        // Loop through each card in the template list and create them in the new list
        for (const templateCard of templateList.Cards) {
          const newCard = await prisma.card.create({
            data: {
              title: templateCard.title,
              description: templateCard.description,
              listId: newList.id, // Associate with the newly created list
            },
          });
          for (const templateChecklist of templateCard.Checklists) {
            const newChecklist = await prisma.checklist.create({
              data: {
                title: templateChecklist.title,
                cardId: newCard.id, // Associate with the newly created card
              },
            });
            for (const templateItem of templateChecklist.ChecklistItems) {
              await prisma.checklistItem.create({
                data: {
                  title: templateItem.title,
                  checklistId: newChecklist.id, // Associate with the newly created checklist
                },
              });
            }
          }
        }
      }

      return newBoard;
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create board from template'
    );
  }
};

export const BoardService = {
  insertIntoDB,
  addBoardMembers,
  removeBoardMember,
  leaveBoard,
  getAllBoardsOfMember,
  getAllBoardsOfAdmin,
  getSingleData,
  updateBoardTitle,
  getAllBoardsOfSingleWorkspace,
  deleteSingleBoard,
  createBoardFromTemplate,
};
