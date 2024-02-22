import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationService } from './semesterRegistration.service';

const create = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await SemesterRegistrationService.create(data);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registraion created successfully!',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const result = await SemesterRegistrationService.update(id, data);
  sendResponse<SemesterRegistration>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester registraion updated successfully!',
    data: result,
  });
});

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user || {};
  const result = await SemesterRegistrationService.startMyRegistration(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student semester registraion has been enrolled successfully!',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user || {};
  const result = await SemesterRegistrationService.enrollCourse(
    userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student has been enrolled into course successfully!',
    data: result,
  });
});

export const SemesterRegistrationController = {
  create,
  update,
  startMyRegistration,
  enrollIntoCourse,
};
