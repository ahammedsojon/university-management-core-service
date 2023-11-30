import { OfferedCourseClassSchedule, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { hasTimeConfilct } from '../../../shared/utils';

const prisma = new PrismaClient();

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
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
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const isAlreadyFacultyBookedOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        daysOfWeek: data.daysOfWeek,
        facultyId: data.facultyId,
      },
    });

  const existingSlots = await isAlreadyFacultyBookedOnDay.map(each => ({
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
      'Faculty has already booked at this time!'
    );
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
