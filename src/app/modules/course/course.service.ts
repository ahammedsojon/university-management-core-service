import { Course, CourseFaculty, Prisma, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { ICourse, ICourseFilters } from './course.interface';

const prisma = new PrismaClient();

const insertToDB = async (data: ICourse): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async tx => {
    const result = await tx.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (const each of preRequisiteCourses) {
        const res = await tx.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            preRequisiteId: each.courseId,
          },
        });
      }
    }
    return result;
  });
  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
};

const update = async (
  id: string,
  data: Partial<ICourse>
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = data;

  await prisma.$transaction(async tx => {
    const result = await tx.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course!');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisite = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && coursePrerequisite.isDelete
      );
      const newPrerequisite = preRequisiteCourses.filter(
        coursePrerequisite =>
          coursePrerequisite.courseId && !coursePrerequisite.isDelete
      );
      console.log(deletePrerequisite, newPrerequisite);

      for (let index = 0; index < deletePrerequisite.length; index++) {
        await prisma.courseToPrerequisite.deleteMany({
          where: {
            AND: [
              {
                courseId: id,
              },
              {
                preRequisiteId: deletePrerequisite[index].courseId,
              },
            ],
          },
        });
      }
      for (let index = 0; index < newPrerequisite.length; index++) {
        await prisma.courseToPrerequisite.create({
          data: {
            courseId: id,
            preRequisiteId: newPrerequisite[index].courseId,
          },
        });
      }
    }

    return result;
  });

  const responseData = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return responseData;
};

const getAll = async (
  filters: ICourseFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[] | null>> => {
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
  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.course.findMany({
    where: whereConditions,
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
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
  const total = await prisma.course.count({
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

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  console.log(payload, 22);

  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId,
    })),
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultiesData;
};

const removeFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultiesData;
};

export const CourseService = {
  insertToDB,
  getAll,
  update,
  assignFaculties,
  removeFaculties,
};
