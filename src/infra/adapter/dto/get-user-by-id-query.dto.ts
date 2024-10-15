import { z } from 'zod';

export const getUserByIdQuerySchema = z.object({
  id: z.string(),
});

export type GetUserByIdQuery = z.infer<typeof getUserByIdQuerySchema>;
