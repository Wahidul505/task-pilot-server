import { Workspace, WorkspaceAdmin } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { IWorkSpacePayload } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { WorkspaceUtils } from './workspace.utils';

const insertIntoDB = async (payload: IWorkSpacePayload) => {
  const { admins, ...workspacePayload } = payload;
  try {
    await prisma.$transaction(async transactionClient => {
      const newWorkspace = await transactionClient.workspace.create({
        data: workspacePayload,
      });

      if (!newWorkspace) {
        throw new ApiError(httpStatus.BAD_GATEWAY, 'Something went wrong');
      }

      for (let index = 0; index < admins.length; index++) {
        await transactionClient.workspaceAdmin.create({
          data: {
            userId: admins[index],
            workspaceId: newWorkspace.id,
          },
        });
      }
    });
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
      Boards: true,
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

export const WorkspaceService = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  getAllWorkspacesOfAdmin,
};
