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
        include: {
          template: true,
        },
      },
      WorkspaceAdmins: true,
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

export const WorkspaceService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  getAllWorkspacesOfAdmin,
  updateSingleData,
};
