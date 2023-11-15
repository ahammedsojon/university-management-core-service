import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CourseService } from './course.service';
import sendResponse from '../../../shared/sendResponse';
import { Course } from '@prisma/client';
import httpStatus from 'http-status';

const insertToDB = catchAsync(async (req: Request, res: Response) => {
  const { ...courseData } = req.body;
  const result = await CourseService.insertToDB(courseData);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

export const CourseController = { insertToDB };
