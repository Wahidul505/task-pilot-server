import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CollabService } from './collab.service';

const collabRequest = catchAsync(async (req: Request, res: Response) => {
  const { board1Id, board2Id } = req?.body;
  const result = await CollabService.collabRequest(
    board1Id,
    board2Id,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Requested',
    data: result,
  });
});

const collabAction = catchAsync(async (req: Request, res: Response) => {
  const { board2Id, status } = req?.body;
  const result = await CollabService.collabAction(
    board2Id,
    req?.params?.collabQueueId,
    req?.user as JwtPayload,
    status
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${status === 'accept' ? 'accepted' : 'declined'}`,
    data: result,
  });
});

const getSingleCollab = catchAsync(async (req: Request, res: Response) => {
  const result = await CollabService.getSingleCollab(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'fetched',
    data: result,
  });
});

export const CollabController = {
  collabRequest,
  collabAction,
  getSingleCollab,
};
