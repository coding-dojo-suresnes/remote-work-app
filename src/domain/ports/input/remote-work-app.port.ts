import { UserPresence } from '../../user-presence.entity';
import { UserWorkSituation } from '../../user-work-situation.entity';

export interface IRemoteWorkApp {
  saveUserWorkSituation(
    username: string,
    date: string,
    situation: UserWorkSituation,
  ): Promise<UserPresence>;
  isUserInOffice(username: string, date: Date): Promise<boolean>;
  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation>;
}
