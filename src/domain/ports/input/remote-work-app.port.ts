import { UserWorkSituation } from 'src/domain/user-work-situation.entity';

export interface IRemoteWorkApp {
  isUserInOffice(username: string, date: Date): Promise<boolean>;
  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation>;
}
