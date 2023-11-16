import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();
router.get('/', CourseController.getAll);
router.post('/create-course', CourseController.insertToDB);
router.patch('/:id', CourseController.update);
router.post(
  '/:id/assign-faculty',
  validateRequest(CourseValidation.assingOrRemoveFaculties),
  CourseController.assignFaculties
);
router.delete(
  '/:id/remove-faculty',
  validateRequest(CourseValidation.assingOrRemoveFaculties),
  CourseController.removeFaculties
);

export const CourseRoute = router;
