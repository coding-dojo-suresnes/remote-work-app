import { UserWorkSituation } from '../../user-work-situation.entity';

export interface IUserWorkSituationPort {
  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation>;
  saveUserWorkSituation(
    username: string,
    date: Date,
    userWorkSituation: UserWorkSituation,
  ): Promise<void>;
}
