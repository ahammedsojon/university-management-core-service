import { z } from 'zod';

const assingOrRemoveFaculties = z.object({
  body: z.object({
    faculties: z.array(z.string(), {
      required_error: 'Faculties are required.',
    }),
  }),
});

export const CourseValidation = { assingOrRemoveFaculties };
