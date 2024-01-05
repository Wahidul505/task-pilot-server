import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { validateUser } from '../../../utils/validateUser';

const getSingleData = async (
  userId: string,
  user: JwtPayload
): Promise<Partial<User>> => {
  validateUser(user, userId);
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { password, ...userInfo } = result;

  return userInfo;
};

const updateSingleData = async (
  userId: string,
  user: JwtPayload,
  payload: Partial<User>
): Promise<Partial<User>> => {
  validateUser(user, userId);
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  const updateSingleData = {
    name: payload.name || isUserExist.name,
    dp: payload.dp || isUserExist.dp,
  };

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateSingleData,
  });

  return updateSingleData;
};

export const UserService = {
  getSingleData,
  updateSingleData,
};
