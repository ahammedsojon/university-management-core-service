import {
  PrismaClient,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  IEnrollCourse,
  ISemesterRegistration,
} from './semesterRegistration.interface';

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

const startMyRegistration = async (
  authId: string
): Promise<{
  semseterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student not found!');
  }

  const semesterInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });
  if (
    semesterInfo &&
    semesterInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semseter registration has not started yet.'
    );
  }

  let result = await prisma.studentSemesterRegistration.findFirst({
    where: {
      AND: [
        {
          studentId: studentInfo?.id,
        },
        {
          semesterRegistrationId: semesterInfo?.id,
        },
      ],
    },
  });
  if (!result) {
    result = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterInfo?.id,
          },
        },
      },
    });
  }

  return {
    semseterRegistration: semesterInfo,
    studentSemesterRegistration: result,
  };
};

const enrollCourse = async (authUserId: string, payload: IEnrollCourse) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  const semesterRegistration = await semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No semester registration is currently ongoing!'
    );
  }

  const result = await prisma.studentSemesterRegistrationCourse.create({
    data: {
      studentId: student?.id,
      semesterRegsitrationId: semesterRegistration?.id,
      offeredCourseId: payload.offeredCourseId,
      offeredCourseSectoinId: payload.offeredCourseSectionId,
    },
  });

  return result;
};

export const SemesterRegistrationService = {
  create,
  update,
  startMyRegistration,
  enrollCourse,
};
