import express from 'express';
import { AcademicDepartmentRoute } from '../modules/academicDeparment/academicDepratment.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoute } from '../modules/academicSemester/academicSemester.route';
import { CourseRoute } from '../modules/course/course.route';
import { StudentRoute } from '../modules/student/student.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoute,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoute,
  },
  {
    path: '/students',
    route: StudentRoute,
  },
  {
    path: '/courses',
    route: CourseRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
