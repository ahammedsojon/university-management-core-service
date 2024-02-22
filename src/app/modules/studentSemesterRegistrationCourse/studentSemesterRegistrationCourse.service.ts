import { PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IEnrollCourse } from '../semesterRegistration/semesterRegistration.interface';

const prisma = new PrismaClient();

const enrollCourse = async (
  authUserId: string,
  payload: IEnrollCourse
): Promise<{ message: string }> => {
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

  const offeredCourse = await offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found!');
  }

  const offeredCourseSection = await offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered Course Section not found!'
    );
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrollStudent &&
    offeredCourseSection.currentlyEnrollStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student capacity is full!');
  }

  await prisma.$transaction(async tracnsactionClinet => {
    const data =
      await tracnsactionClinet.studentSemesterRegistrationCourse.create({
        data: {
          studentId: student?.id,
          semesterRegsitrationId: semesterRegistration?.id,
          offeredCourseId: payload.offeredCourseId,
          offeredCourseSectoinId: payload.offeredCourseSectionId,
        },
      });

    await tracnsactionClinet.offeredCourseSection.update({
      where: {
        id: offeredCourseSection?.id,
      },
      data: {
        currentlyEnrollStudent: {
          increment: 1,
        },
      },
    });

    await tracnsactionClinet.studentSemesterRegistration.update({
      where: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.totalCreditsTaken,
        },
      },
    });
  });

  return {
    message: 'Studnet enrolled into course successfully!',
  };
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCourse
): Promise<{ message: string }> => {
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

  const offeredCourse = await offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found!');
  }

  await prisma.$transaction(async tracnsactionClinet => {
    const data =
      await tracnsactionClinet.studentSemesterRegistrationCourse.delete({
        where: {
          semesterRegistrationId_studentId_offeredCourseId: {
            semesterRegistrationId: semesterRegistration.id,
            studentId: student.id,
            _offeredCourseId: offeredCourse.id,
          },
        },
      });

    await tracnsactionClinet.offeredCourseSection.update({
      where: {
        id: offeredCourseSection?.id,
      },
      data: {
        currentlyEnrollStudent: {
          decrement: 1,
        },
      },
    });

    await tracnsactionClinet.studentSemesterRegistration.update({
      where: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.totalCreditsTaken,
        },
      },
    });
  });

  return {
    message: 'Studnet withdraw from course successfully!',
  };
};

export const studentSemesterRegistrationCourseService = {
  enrollCourse,
  withdrawFromCourse,
};
