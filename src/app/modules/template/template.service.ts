import { Template } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Template): Promise<Template> => {
  const result = await prisma.template.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (): Promise<Template[]> => {
  const result = await prisma.template.findMany();
  return result;
};

const getSingleData = async (id: string): Promise<Template | null> => {
  const result = await prisma.template.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSingleData = async (
  id: string,
  payload: Partial<Template>
): Promise<Template | null> => {
  const result = await prisma.template.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSingleData = async (id: string): Promise<Template | null> => {
  const result = await prisma.template.delete({
    where: {
      id,
    },
  });
  return result;
};

export const TemplateService = {
  insertIntoDB,
  getAllFromDB,
  getSingleData,
  updateSingleData,
  deleteSingleData,
};
