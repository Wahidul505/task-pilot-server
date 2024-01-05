import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WorkspaceService } from './workspace.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workspace created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workspaces fetched',
    data: result,
  });
});

export const WorkspaceController = {
  insertIntoDB,
  getAllFromDB,
};
