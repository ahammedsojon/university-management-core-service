import { OfferedCourse, PrismaClient } from '@prisma/client';
import { asyncForEach } from '../../../shared/asyncForEach';
import { IOfferedCourse } from './offeredCourse.interface';

const prisma = new PrismaClient();

const create = async (payload: IOfferedCourse): Promise<OfferedCourse[]> => {
  const { academicSemesterId, semesterRegistrationId, courseIds } = payload;
  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicSemesterId,
        semesterRegistrationId,
        courseId,
      },
    });

    if (!alreadyExist) {
      const res = await prisma.offeredCourse.create({
        data: {
          academicSemesterId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicSemester: true,
          semesterRegistration: true,
          course: true,
        },
      });
      result.push(res);
    }
  });

  return result;
};

export const OfferedCourseService = { create };
