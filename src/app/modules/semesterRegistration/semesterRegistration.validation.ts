import { z } from 'zod';

const create = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start date is required.',
    }),
    endDate: z.string({
      required_error: 'End date is required.',
    }),
    status: z.enum(['UPCOMING', 'ONGOING', 'ENDED']).optional(),
    minCredit: z.number({
      required_error: 'Minimum credit is required.',
    }),
    maxCredit: z.number({
      required_error: 'Maximum credit is required.',
    }),
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required.',
    }),
  }),
});

export const SemesterRegistrationValidation = { create };
