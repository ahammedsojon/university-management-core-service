import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const create = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await OfferedCourseSectionService.create(data);
  sendResponse<OfferedCourseSection>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course section created successfully!',
    data: result,
  });
});

export const OfferedCourseSectionController = { create };
