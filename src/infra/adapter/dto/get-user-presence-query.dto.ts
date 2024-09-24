import { z } from 'zod';

export const getUserPresenceQuerySchema = z.object({
  username: z.string(),
  date: z.string().date(),
});

export type GetUserPresenceQuery = z.infer<typeof getUserPresenceQuerySchema>;
