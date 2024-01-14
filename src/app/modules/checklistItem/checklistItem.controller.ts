import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ChecklistItemService } from './checklistItem.service';

const createChecklistItem = catchAsync(async (req: Request, res: Response) => {
  const result = await ChecklistItemService.createChecklistItem(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checklist item created',
    data: result,
  });
});

export const ChecklistItemController = {
  createChecklistItem,
};
