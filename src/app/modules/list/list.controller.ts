import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ListService } from './list.service';

const createList = catchAsync(async (req: Request, res: Response) => {
  const result = await ListService.createList(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'List created',
    data: result,
  });
});

const getAllLists = catchAsync(async (req: Request, res: Response) => {
  const result = await ListService.getAllLists(
    req?.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lists fetched',
    data: result,
  });
});

const getSingleList = catchAsync(async (req: Request, res: Response) => {
  const result = await ListService.getSingleList(
    req?.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'List fetched',
    data: result,
  });
});

const updateListTitle = catchAsync(async (req: Request, res: Response) => {
  const result = await ListService.updateListTitle(
    req?.params?.id as string,
    req?.body as { title: string; boardId: string },
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'List title updated',
    data: result,
  });
});

const deleteSingleList = catchAsync(async (req: Request, res: Response) => {
  const result = await ListService.deleteSingleList(
    req?.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'List deleted',
    data: result,
  });
});

export const ListController = {
  createList,
  getAllLists,
  getSingleList,
  updateListTitle,
  deleteSingleList,
};
