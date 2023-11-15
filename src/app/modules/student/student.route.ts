import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get('/', StudentController.getAll);
router.get('/:id', StudentController.getSingle);
router.post(
  '/',
  validateRequest(StudentValidation.create),
  StudentController.create
);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  StudentController.update
);
router.delete('/:id', StudentController.deleteFromDB);

export const StudentRoute = router;
