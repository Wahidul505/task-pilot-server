import { UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';

export const validateAdmin = (jwtUser: JwtPayload, fetchedUser: any) => {
  if (jwtUser?.role === UserRole.admin) {
    if (fetchedUser?.role !== UserRole.client) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
  }
};
