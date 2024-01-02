import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';

export const validateUser = (user: JwtPayload, userId: string) => {
  if (user?.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not allowed');
  }
};
