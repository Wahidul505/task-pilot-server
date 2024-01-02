import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IWorkSpacePayload } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';

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

export const WorkspaceService = {
  insertIntoDB,
};
