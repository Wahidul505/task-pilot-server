import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const checkAdminExistInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const adminExist = await prisma.workspaceAdmin.findFirst({
    where: {
      workspaceId: workspaceId,
      userId: userId,
    },
  });

  if (!adminExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not Authorized');
  }
};

export const WorkspaceUtils = {
  checkAdminExistInWorkspace,
};
