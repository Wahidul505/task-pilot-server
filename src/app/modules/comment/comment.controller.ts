import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';

const addComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.addComment(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'commented',
    data: result,
  });
});

export const CommentController = {
  addComment,
};
