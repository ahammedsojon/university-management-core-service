import { Prisma, PrismaClient, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { studentSearchAbleFields } from './student.constant';
import { IStudent, IStudentFilter } from './student.interface';

const prisma = new PrismaClient();

const create = async (data: IStudent): Promise<Student> => {
  const result = await prisma.student.create({
    data,
  });
  return result;
};

const getAll = async (
  filters: IStudentFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[] | null>> => {
  const { searchTerm, ...filtersData } = filters;
  const { sortBy, sortOrder } = options;
  const andConditions = [];
  console.log(searchTerm, filtersData);

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.student.findMany({
    where: whereConditions,
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
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
  const total = await prisma.student.count({
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

const getSingle = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const update = async (
  id: string,
  data: Partial<IStudent>
): Promise<Student | null> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StudentService = {
  create,
  getAll,
  getSingle,
  update,
  deleteFromDB,
};
