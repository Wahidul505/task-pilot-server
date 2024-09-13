import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ThemeService } from './theme.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Theme created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Themes fetched',
    data: result,
  });
});

const getSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.getSingleData(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Themes fetched',
    data: result,
  });
});

const updateSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.updateSingleData(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Themes updated',
    data: result,
  });
});

const deleteSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await ThemeService.deleteSingleData(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Themes deleted',
    data: result,
  });
});

export const ThemeController = {
  insertIntoDB,
  getAllFromDB,
  getSingleData,
  updateSingleData,
  deleteSingleData,
};
