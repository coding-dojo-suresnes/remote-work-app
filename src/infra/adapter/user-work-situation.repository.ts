import { IUserWorkSituationPort, UserWorkSituation } from '../../domain';

export class UserWorkSituationRepository implements IUserWorkSituationPort {
  private users: Map<string, Map<Date, UserWorkSituation>> = new Map();

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return Promise.resolve(
      this.users.get(username)?.get(date) ?? UserWorkSituation.NOT_DEFINED,
    );
  }

  saveUserWorkSituation(
    username: string,
    date: Date,
    userWorkSituation: UserWorkSituation,
  ): Promise<void> {
    if (!this.users.has(username)) {
      this.users.set(username, new Map());
    }
    this.users.get(username)?.set(date, userWorkSituation);
    return Promise.resolve();
  }
}
