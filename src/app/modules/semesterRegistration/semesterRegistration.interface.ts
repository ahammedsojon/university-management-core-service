export type ISemesterRegistration = {
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  minDate: number;
  maxDate: number;
  academicSemesterId: string;
};

export type IEnrollCourse = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
