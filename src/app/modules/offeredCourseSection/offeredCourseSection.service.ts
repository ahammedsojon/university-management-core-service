import { OfferedCourseSection, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IOfferedCourseSection } from './offeredCourseSection.interface';

const prisma = new PrismaClient();

const create = async (
  payload: IOfferedCourseSection
): Promise<OfferedCourseSection> => {
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });
  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Offered course doesn't match");
  }
  const result = await prisma.offeredCourseSection.create({
    data: {
      ...payload,
      semesterRegistrationId: offeredCourse.semesterRegistrationId,
    },
  });

  return result;
};

export const OfferedCourseSectionService = { create };
