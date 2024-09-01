import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChecklistService } from './checklist.service';

const createChecklist = catchAsync(async (req: Request, res: Response) => {
  const result = await ChecklistService.createChecklist(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checklist created',
    data: result,
  });
});

const updateChecklistTitle = catchAsync(async (req: Request, res: Response) => {
  const result = await ChecklistService.updateChecklistTitle(
    req?.params?.id,
    req?.body as { title: string },
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checklist title updated',
    data: result,
  });
});

const getAllChecklist = catchAsync(async (req: Request, res: Response) => {
  const result = await ChecklistService.getAllChecklist(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checklists fetched',
    data: result,
  });
});

const deleteSingleChecklist = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ChecklistService.deleteSingleChecklist(
      req?.params?.id,
      req?.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Checklist deleted',
      data: result,
    });
  }
);

export const ChecklistController = {
  createChecklist,
  updateChecklistTitle,
  getAllChecklist,
  deleteSingleChecklist,
};
