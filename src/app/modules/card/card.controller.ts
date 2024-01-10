import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CardService } from './card.service';

const createCard = catchAsync(async (req: Request, res: Response) => {
  const result = await CardService.createCard(
    req.body,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Card created',
    data: result,
  });
});

const getAllCards = catchAsync(async (req: Request, res: Response) => {
  const result = await CardService.getAllCards(
    req.params?.id as string,
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cards fetched',
    data: result,
  });
});

const updateListId = catchAsync(async (req: Request, res: Response) => {
  const result = await CardService.updateListId(
    req.params?.id as string,
    req?.body as { listId: string },
    req?.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'List ID Updated',
    data: result,
  });
});

export const CardController = {
  createCard,
  getAllCards,
  updateListId,
};
