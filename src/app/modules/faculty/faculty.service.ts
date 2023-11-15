import { Faculty, Prisma, PrismaClient } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { facultySearchAbleFields } from './faculty.constant';
import { IFaculty, IFacultyFilter } from './faculty.interface';

const prisma = new PrismaClient();

const create = async (data: IFaculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
  });
  return result;
};

const getAll = async (
  filters: IFacultyFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[] | null>> => {
  const { searchTerm, ...filtersData } = filters;
  const { sortBy, sortOrder } = options;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(field => ({
        [field]: {
          equals: (filtersData as Record<string, string>)[field],
        },
      })),
    });
  }

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.faculty.findMany({
    where: whereConditions,
    include: {
      academicDepartment: true,
      academicFaculty: true,
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
  const total = await prisma.faculty.count({
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

const getSingle = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const update = async (
  id: string,
  data: Partial<IFaculty>
): Promise<Faculty | null> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });
  return result;
};

export const FacultyService = {
  create,
  getAll,
  getSingle,
  update,
  deleteFromDB,
};
