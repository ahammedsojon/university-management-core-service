import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.get('/', AcademicDepartmentController.getAll);
router.get('/:id', AcademicDepartmentController.getSingle);
router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.create),
  AcademicDepartmentController.create
);
router.patch(
  '/:id',
  validateRequest(AcademicDepartmentValidation.update),
  AcademicDepartmentController.update
);
router.delete('/:id', AcademicDepartmentController.deleteFromDB);

export const AcademicDepartmentRoute = router;
