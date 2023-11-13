import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();

router.get('/', AcademicSemesterController.getAllAcademicSemesters);
router.post(
  '/create-semester',
  AcademicSemesterController.createAcademicSemester
);

export const AcademicSemesterRoute = router;
