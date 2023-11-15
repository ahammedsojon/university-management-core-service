import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { FacultyService } from './faculty.service';
import { facultyFilterAbleFields } from './faculty.constant';
import { Faculty } from '@prisma/client';

const create = catchAsync(async (req: Request, res: Response) => {
  const { ...facultyData } = req.body;
  const result = await FacultyService.create(facultyData);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully!',
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterAbleFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await FacultyService.getAll(filters, options);
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty retrived successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingle = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getSingle(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty retrived successfully!',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const result = await FacultyService.update(id, data);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully!',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.deleteFromDB(req.params.id);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully!',
    data: result,
  });
});

export const FacultyController = {
  create,
  getAll,
  getSingle,
  update,
  deleteFromDB,
};
