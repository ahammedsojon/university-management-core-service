import express from 'express';
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route';
import { CourseRoute } from '../modules/course/course.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/courses',
    route: CourseRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
