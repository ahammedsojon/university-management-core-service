import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required.',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester registration id is required.',
    }),
    courseIds: z.array(
      z.string({
        required_error: 'Course Id is required.',
      }),
      {
        required_error: 'Course Ids is required.',
      }
    ),
  }),
});

export const OfferedCourseValidation = { create };
