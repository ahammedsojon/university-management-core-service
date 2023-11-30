import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.get('/', OfferedCourseClassScheduleController.getAll);
router.post('/', OfferedCourseClassScheduleController.create);

export const OfferedCourseClassScheduleRoute = router;
