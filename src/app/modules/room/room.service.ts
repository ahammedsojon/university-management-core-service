import { Prisma, PrismaClient, Room } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IRoom, IRoomFilterAbleFields } from './room.interface';

const prisma = new PrismaClient();

const create = async (data: IRoom): Promise<Room> => {
  const result = await prisma.room.create({
    data,
  });
  return result;
};

const getAll = async (
  filters: IRoomFilterAbleFields,
  options: IPaginationOptions
): Promise<IGenericResponse<Room[] | null>> => {
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
  const whereConditions: Prisma.RoomWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.room.findMany({
    where: whereConditions,
    include: {
      building: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
  });
  const total = await prisma.room.count({
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

const getSingle = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const update = async (
  id: string,
  data: Partial<IRoom>
): Promise<Room | null> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
  });
  return result;
};

export const RoomService = {
  create,
  getAll,
  getSingle,
  update,
  deleteFromDB,
};
