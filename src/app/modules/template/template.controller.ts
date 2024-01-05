import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TemplateService } from './template.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Templates fetched',
    data: result,
  });
});

const getSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.getSingleData(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template fetched',
    data: result,
  });
});

const updateSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.updateSingleData(
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template updated',
    data: result,
  });
});

const deleteSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await TemplateService.deleteSingleData(
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Template deleted',
    data: result,
  });
});

export const TemplateController = {
  insertIntoDB,
  getAllFromDB,
  getSingleData,
  updateSingleData,
  deleteSingleData,
};
