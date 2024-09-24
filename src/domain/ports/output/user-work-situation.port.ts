import { UserPresence } from '../../user-presence.entity';
import { UserWorkSituation } from '../../user-work-situation.entity';

export interface IUserWorkSituationPort {
  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation>;

  persistUserWeekPresence(
    userWeekPresence: UserPresence,
  ): Promise<UserPresence>;
}
