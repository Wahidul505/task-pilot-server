import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TemplateService } from './template.service';

const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const { boardId, templateTitle } = req?.body;
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

const getAllTemplatesOfSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TemplateService.getAllTemplatesOfSingleUser(
      req?.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Templates fetched',
      data: result,
    });
  }
);

export const TemplateController = {
  createTemplate,
  getAllTemplatesOfSingleUser,
};
