import { Workspace, WorkspaceAdmin } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IWorkSpacePayload } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { WorkspaceUtils } from './workspace.utils';

const insertIntoDB = async (user: JwtPayload, payload: IWorkSpacePayload) => {
  const { admins, ...workspacePayload } = payload;
  const newAdmins = admins.find(admin => admin !== user?.userId)
    ? [...admins, user?.userId]
    : [...admins];

  try {
    await prisma.$transaction(async transactionClient => {
      const newWorkspace = await transactionClient.workspace.create({
        data: workspacePayload,
      });

      if (!newWorkspace) {
        throw new ApiError(httpStatus.BAD_GATEWAY, 'Something went wrong');
      }

      for (let index = 0; index < newAdmins.length; index++) {
        await transactionClient.workspaceAdmin.create({
          data: {
            userId: newAdmins[index],
            workspaceId: newWorkspace.id,
          },
        });
      }
    });
    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

const getAllFromDB = async (): Promise<Workspace[]> => {
  const result = await prisma.workspace.findMany({
    include: {
      WorkspaceAdmins: true,
    },
  });
  return result;
};

const getSingleFromDB = async (
  id: string,
  user: JwtPayload
): Promise<Workspace | null> => {
  await WorkspaceUtils.checkAdminExistInWorkspace(user?.userId, id);
  const result = await prisma.workspace.findUnique({
    where: {
      id,
    },
    include: {
      Boards: {
        where: {
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
        },
      },
      WorkspaceAdmins: {
        include: {
          user: true,
        },
      },
    },
  });
  return result;
};

const getAllWorkspacesOfAdmin = async (
  user: JwtPayload
): Promise<WorkspaceAdmin[]> => {
  const result = await prisma.workspaceAdmin.findMany({
    where: {
      userId: user?.userId,
    },
    include: {
      workspace: true,
    },
  });
  return result;
};

const getAllWorkspacesOfGuest = async (
  user: JwtPayload
): Promise<Workspace[]> => {
  const result = await prisma.workspace.findMany({
    where: {
      WorkspaceAdmins: {
        none: {
          userId: user?.userId,
        },
      },
      Boards: {
        some: {
          BoardMembers: {
            some: {
              userId: user?.userId,
            },
          },
        },
      },
    },
    include: {
      Boards: {
        where: {
          BoardMembers: {
            some: {
              userId: user?.userId,
            },
          },
        },
        include: {
          template: true,
        },
      },
      WorkspaceAdmins: {
        include: {
          user: true,
        },
      },
    },
  });
  return result;
};

const updateSingleData = async (
  id: string,
  payload: Partial<Workspace>,
  user: JwtPayload
): Promise<Workspace> => {
  await WorkspaceUtils.checkAdminExistInWorkspace(user?.userId, id);
  const result = await prisma.workspace.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const addWorkspaceAdmins = async (
  id: string,
  payload: any,
  user: JwtPayload
) => {
  try {
    await WorkspaceUtils.checkAdminExistInWorkspace(user?.userId, id);

    const admins = payload?.admins?.filter(
      (admin: string) => admin !== user?.userId
    );

    for (let index = 0; index < admins.length; index++) {
      const result = await prisma.workspaceAdmin.create({
        data: {
          workspaceId: id,
          userId: admins[index],
        },
      });
      console.log({ result });
    }
    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Added');
  }
};

const removeWorkspaceAdmin = async (
  id: string,
  payload: { adminId: string },
  user: JwtPayload
) => {
  await WorkspaceUtils.checkAdminExistInWorkspace(user?.userId, id);
  await prisma.workspaceAdmin.deleteMany({
    where: {
      workspaceId: id,
      userId: payload.adminId as string,
    },
  });
  return payload;
};

export const WorkspaceService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  getAllWorkspacesOfAdmin,
  updateSingleData,
  addWorkspaceAdmins,
  removeWorkspaceAdmin,
  getAllWorkspacesOfGuest,
};
