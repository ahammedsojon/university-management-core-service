import {
  OfferedCourseClassSchedule,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  offeredCourseClassScheduleFilterableFields,
  offeredCourseClassScheduleFilterableFieldsMapper,
} from './offeredCourseClassSchedule.constant';
import { IOfferedCourseClassScheduleFilters } from './offeredCourseClassSchedule.interface';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const prisma = new PrismaClient();

const create = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailable(data);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailable(data);

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      room: true,
      offeredCourseSection: true,
      faculty: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const getAll = async (
  filters: IOfferedCourseClassScheduleFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[] | null>> => {
  const { searchTerm, ...filtersData } = filters;
  const { sortBy, sortOrder } = options;
  const andConditions = [];
  console.log(filtersData);

  if (searchTerm) {
    andConditions.push({
      OR: ['daysOfWeek'].map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (offeredCourseClassScheduleFilterableFields.includes(key)) {
          return {
            [offeredCourseClassScheduleFilterableFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereConditions,
    include: {
      offeredCourseSection: true,
      semesterRegistration: true,
      room: true,
      faculty: true,
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
  const total = await prisma.offeredCourseClassSchedule.count({
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

export const OfferedCourseClassScheduleService = { create, getAll };
