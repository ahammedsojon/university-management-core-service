import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.post('/', OfferedCourseClassScheduleController.create);

export const OfferedCourseClassScheduleRoute = router;