import { OfferedCourseClassSchedule } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';

const create = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await OfferedCourseClassScheduleService.create(data);
  sendResponse<OfferedCourseClassSchedule>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course class schedule created successfully!',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...offeredCourseClassScheduleFilterableFields,
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await OfferedCourseClassScheduleService.getAll(
    filters,
    options
  );
  sendResponse<OfferedCourseClassSchedule[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course class schdules retrived successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const OfferedCourseClassScheduleController = { create, getAll };
