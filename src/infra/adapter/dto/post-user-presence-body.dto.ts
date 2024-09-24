import { z } from 'zod';

import { UserWorkSituation } from '../../../domain';

export const postUserPresenceBodySchema = z.object({
  username: z.string(),
  date: z.string().date(),
  situation: z.nativeEnum(UserWorkSituation),
});

export type PostUserPresenceBody = z.infer<typeof postUserPresenceBodySchema>;
