import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.get('/', AcademicSemesterController.getAllAcademicSemesters);
router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);
router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.create),
  AcademicSemesterController.createAcademicSemester
);
router.patch(
  '/:id',
  validateRequest(AcademicSemesterValidation.update),
  AcademicSemesterController.updateAcademicSemester
);
router.delete(
  '/:id',
  validateRequest(AcademicSemesterValidation.update),
  AcademicSemesterController.deleteAcademicSemester
);

export const AcademicSemesterRoute = router;
