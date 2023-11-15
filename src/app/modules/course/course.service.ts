import { Course, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ICourse } from './course.interface';

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

    if (preRequisiteCourses.length > 0) {
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

export const CourseService = { insertToDB };
