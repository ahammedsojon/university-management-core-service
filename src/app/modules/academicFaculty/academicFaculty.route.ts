import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.contoller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.get('/', AcademicFacultyController.getAll);
router.get('/:id', AcademicFacultyController.getSingle);
router.post(
  '/',
  validateRequest(AcademicFacultyValidation.create),
  AcademicFacultyController.create
);
router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.update),
  AcademicFacultyController.update
);
router.delete('/:id', AcademicFacultyController.deleteFromDB);

export const AcademicFacultyRoute = router;
