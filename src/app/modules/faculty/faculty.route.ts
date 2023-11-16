import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyController.getAll);
router.get('/:id', FacultyController.getSingle);
router.post(
  '/',
  validateRequest(FacultyValidation.create),
  FacultyController.create
);
router.patch(
  '/:id',
  validateRequest(FacultyValidation.update),
  FacultyController.update
);
router.delete('/:id', FacultyController.deleteFromDB);
router.post(
  '/:id/assign-course',
  validateRequest(FacultyValidation.assingOrRemoveCourses),
  FacultyController.assignCourses
);
router.delete(
  '/:id/remove-course',
  validateRequest(FacultyValidation.assingOrRemoveCourses),
  FacultyController.removeCourses
);

export const FacultyRoute = router;
