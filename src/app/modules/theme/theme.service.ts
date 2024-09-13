import { Theme } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Theme): Promise<Theme> => {
  const result = await prisma.theme.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (): Promise<Theme[]> => {
  const result = await prisma.theme.findMany();
  return result;
};

const getSingleData = async (id: string): Promise<Theme | null> => {
  const result = await prisma.theme.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSingleData = async (
  id: string,
  payload: Partial<Theme>
): Promise<Theme | null> => {
  const result = await prisma.theme.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSingleData = async (id: string): Promise<Theme | null> => {
  const result = await prisma.theme.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ThemeService = {
  insertIntoDB,
  getAllFromDB,
  getSingleData,
  updateSingleData,
  deleteSingleData,
};
