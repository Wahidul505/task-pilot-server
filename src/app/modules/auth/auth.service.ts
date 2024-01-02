import { User } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const signup = async (payload: User): Promise<string> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const result = await prisma.user.create({
    data: payload,
  });

  const userInfo = {
    userId: result.id,
    userEmail: result.email,
  };

  const token = jwtHelpers.createToken(
    userInfo,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  return token;
};

const login = async (payload: Partial<User>): Promise<string> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  if (isUserExist.password !== payload.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong Password');
  }

  const userInfo = {
    userId: isUserExist.id,
    userEmail: isUserExist.email,
  };

  const token = jwtHelpers.createToken(
    userInfo,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  return token;
};

export const AuthService = {
  signup,
  login,
};
