import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BoardService } from './board.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.insertIntoDB(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Board created',
    data: result,
  });
});

const addBoardMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.addBoardMembers(
    req.params.id,
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Members added',
    data: result,
  });
});

const removeBoardMember = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.removeBoardMember(
    req.params.id,
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member removed',
    data: result,
  });
});

const leaveBoard = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.leaveBoard(
    req.params.id,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You left from the board',
    data: result,
  });
});

const getAllBoardsOfMember = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.getAllBoardsOfMember(
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fetched Boards',
    data: result,
  });
});

const getAllBoardsOfAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email } = req?.body;
  const result = await BoardService.getAllBoardsOfAdmin(email as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fetched Boards',
    data: result,
  });
});

const getAllBoardsOfSingleWorkspace = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BoardService.getAllBoardsOfSingleWorkspace(
      req?.params?.workspaceId as string,
      req?.user as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Fetched Boards',
      data: result,
    });
  }
);

const getSingleData = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.getSingleData(
    req?.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Board Fetched',
    data: result,
  });
});

const updateBoardTitle = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.updateBoardTitle(
    req?.params?.id as string,
    req?.body as { title: string },
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Board updated',
    data: result,
  });
});

const deleteSingleBoard = catchAsync(async (req: Request, res: Response) => {
  const result = await BoardService.deleteSingleBoard(
    req?.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Board deleted',
    data: result,
  });
});

const createBoardFromTemplate = catchAsync(
  async (req: Request, res: Response) => {
    const { templateId, workspaceId } = req?.body;
    const result = await BoardService.createBoardFromTemplate(
      req?.user as JwtPayload,
      templateId as string,
      workspaceId as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Board created',
      data: result,
    });
  }
);

export const BoardController = {
  insertIntoDB,
  addBoardMembers,
  removeBoardMember,
  leaveBoard,
  getAllBoardsOfMember,
  getAllBoardsOfAdmin,
  getAllBoardsOfSingleWorkspace,
  getSingleData,
  updateBoardTitle,
  deleteSingleBoard,
  createBoardFromTemplate,
};
