import {
  PrismaClient,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ISemesterRegistration } from './semesterRegistration.interface';

const prisma = new PrismaClient();

const create = async (
  data: ISemesterRegistration
): Promise<SemesterRegistration> => {
  const isRegistrationNotAvailable =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isRegistrationNotAvailable) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already have an semester registration ${isRegistrationNotAvailable.status}`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

const update = async (
  id: string,
  data: Partial<ISemesterRegistration>
): Promise<SemesterRegistration> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Data doesn't  exist!");
  }

  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    data.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can move onlty from UPCOMING to ONGOING'
    );
  }
  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    data.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can move onlty from ONGOING to ENDED'
    );
  }
  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

export const SemesterRegistrationService = { create, update };
