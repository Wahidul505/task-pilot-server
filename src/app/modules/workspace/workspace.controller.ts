import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WorkspaceService } from './workspace.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.insertIntoDB(
    req?.user as JwtPayload,
    req?.body
  );
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

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.getSingleFromDB(
    req.params.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workspace fetched',
    data: result,
  });
});

const getAllWorkspacesOfAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await WorkspaceService.getAllWorkspacesOfAdmin(
      req?.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Workspaces fetched',
      data: result,
    });
  }
);

const getAllWorkspacesOfGuest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await WorkspaceService.getAllWorkspacesOfGuest(
      req?.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Workspaces fetched',
      data: result,
    });
  }
);

const updateSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.updateSingleData(
    req?.params?.id as string,
    req?.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workspace updated',
    data: result,
  });
});

const addWorkspaceAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.addWorkspaceAdmins(
    req?.params?.id as string,
    req?.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins added',
    data: result,
  });
});

const removeWorkspaceAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkspaceService.removeWorkspaceAdmin(
    req?.params?.id as string,
    req?.body as { adminId: string },
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin removed',
    data: result,
  });
});

export const WorkspaceController = {
  insertIntoDB,
  getAllFromDB,
  getSingleFromDB,
  getAllWorkspacesOfAdmin,
  getAllWorkspacesOfGuest,
  updateSingleData,
  addWorkspaceAdmins,
  removeWorkspaceAdmin,
};
