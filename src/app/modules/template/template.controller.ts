import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TemplateService } from './template.service';

const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const { boardId, templateTitle } = req?.body;
  console.log(1, req?.user);
  const result = await TemplateService.createTemplate(
    req?.user as JwtPayload,
    boardId as string,
    templateTitle as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template created',
    data: result,
  });
});

export const TemplateController = { createTemplate };
