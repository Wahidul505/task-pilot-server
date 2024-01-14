import { ChecklistItem } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ChecklistItemUtils } from './checklistItem.utils';

const createChecklistItem = async (
  payload: ChecklistItem,
  user: JwtPayload
): Promise<ChecklistItem> => {
  await ChecklistItemUtils.checkEitherAdminOrMemberInBoard(
    payload?.checklistId,
    user?.userId
  );

  const result = await prisma.checklistItem.create({
    data: payload,
  });
  return result;
};

const updateSingleChecklistItem = async (
  id: string,
  payload: Partial<ChecklistItem>,
  user: JwtPayload
): Promise<ChecklistItem> => {
  const checklist = await prisma.checklistItem.findUnique({
    where: {
      id,
    },
  });
  if (!checklist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Checklist not found');
  await ChecklistItemUtils.checkEitherAdminOrMemberInBoard(
    checklist?.checklistId,
    user?.userId
  );

  const result = await prisma.checklistItem.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSingleChecklistItem = async (
  id: string,
  user: JwtPayload
): Promise<ChecklistItem> => {
  const checklist = await prisma.checklistItem.findUnique({
    where: {
      id,
    },
  });
  if (!checklist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Checklist not found');
  await ChecklistItemUtils.checkEitherAdminOrMemberInBoard(
    checklist?.checklistId,
    user?.userId
  );

  const result = await prisma.checklistItem.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ChecklistItemService = {
  createChecklistItem,
  updateSingleChecklistItem,
  deleteSingleChecklistItem,
};
