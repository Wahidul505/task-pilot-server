import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string().optional(),
    admins: z.array(
      z.string({
        required_error: 'admin is required',
      })
    ),
  }),
});

export const MakeoverServiceValidation = {
  create,
};
