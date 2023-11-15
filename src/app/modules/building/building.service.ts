import { Building, Prisma, PrismaClient } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  IAcademicBuildingFilterAbleFields,
  IBuilding,
} from './building.interface';

const prisma = new PrismaClient();

const create = async (data: IBuilding): Promise<Building> => {
  const result = await prisma.building.create({
    data,
  });
  return result;
};

const getAll = async (
  filters: IAcademicBuildingFilterAbleFields,
  options: IPaginationOptions
): Promise<IGenericResponse<Building[] | null>> => {
  const { searchTerm } = filters;
  const { sortBy, sortOrder } = options;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['title'].map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
  });
  const total = await prisma.building.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingle = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const update = async (
  id: string,
  data: Partial<IBuilding>
): Promise<Building | null> => {
  const result = await prisma.building.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BuildingService = {
  create,
  getAll,
  getSingle,
  update,
  deleteFromDB,
};
