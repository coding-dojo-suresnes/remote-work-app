import { z } from 'zod';

export const postUserBodySchema = z.object({
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type PostUserBody = z.infer<typeof postUserBodySchema>;
