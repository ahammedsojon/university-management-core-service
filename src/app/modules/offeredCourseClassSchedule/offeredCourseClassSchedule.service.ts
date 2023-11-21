import { OfferedCourseClassSchedule, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { hasTimeConfilct } from '../../../shared/utils';

const prisma = new PrismaClient();

const create = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  const isAlreadyRoomBookedOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        daysOfWeek: data.daysOfWeek,
        roomId: data.roomId,
      },
    });

  const existingSlots = await isAlreadyRoomBookedOnDay.map(each => ({
    startTime: each.startTime,
    endTime: each.endTime,
    daysOfWeek: each.daysOfWeek,
  }));

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    daysOfWeek: data.daysOfWeek,
  };

  if (await hasTimeConfilct(existingSlots, newSlot)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Room has already booked at this time!'
    );
  }

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

export const OfferedCourseClassScheduleService = { create };
