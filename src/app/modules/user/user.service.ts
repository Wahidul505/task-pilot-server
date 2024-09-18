import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { exclude } from '../../../utils/exclude';
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
): Promise<string> => {
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
    cover: payload.cover || isUserExist.cover,
  };

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateSingleData,
  });

  const updatedUser = await prisma.user.findFirst({ where: { id: userId } });

  const userInfo = {
    userId: updatedUser?.id,
    userEmail: updatedUser?.email,
    userName: updatedUser?.name || '',
    userDp: updatedUser?.dp || '',
    userCover: updatedUser?.cover || '',
  };

  const token = jwtHelpers.createToken(
    userInfo,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return token;
};

const getAllFromDB = async () => {
  const users = await prisma.user.findMany();
  const result = users?.map(user => exclude(user, ['password']));
  return result;
};

export const UserService = {
  getSingleData,
  updateSingleData,
  getAllFromDB,
};
