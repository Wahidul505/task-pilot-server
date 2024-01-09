import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getSingleData = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.params?.id;
  const user = req?.user;
  const result = await UserService.getSingleData(userId, user as JwtPayload);
  sendResponse<Partial<User>>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateSingleData = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.params?.id;
  const user = req?.user;
  const payload = req?.body;
  const result = await UserService.updateSingleData(
    userId,
    user as JwtPayload,
    payload
  );
  sendResponse<Partial<User>>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Fetched',
    data: result,
  });
});

export const UserController = {
  getSingleData,
  updateSingleData,
  getAllFromDB,
};
