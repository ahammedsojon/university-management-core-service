export const offeredCourseClassScheduleFilterableFields = [
  'daysOfWeek',
  'offeredCourseSectionId',
  'roomId',
  'facultyId',
  'semesterRegistrationId',
];
export const offeredCourseClassScheduleFilterableFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseSectionId: 'offeredCourseSection',
  roomId: 'room',
  facultyId: 'faculty',
  semesterRegistrationId: 'semesterRegistration',
};
