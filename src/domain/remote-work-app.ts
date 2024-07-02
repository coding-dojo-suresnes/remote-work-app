import { IRemoteWorkApp, IUserWorkSituationPort } from './ports';
import { UserWorkSituation } from './user-work-situation.entity';

export class RemoteWorkApp implements IRemoteWorkApp {
  constructor(private readonly userPresencePort: IUserWorkSituationPort) {}

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return this.userPresencePort.getUserWorkSituation(username, date);
  }

  public async isUserInOffice(username: string, date: Date): Promise<boolean> {
    const workSituation: UserWorkSituation =
      await this.userPresencePort.getUserWorkSituation(username, date);
    switch (workSituation) {
      case UserWorkSituation.IN_OFFICE:
        return true;
      case UserWorkSituation.REMOTE:
        return false;
      default:
        throw new Error('NOT IMPLEMENTED');
    }
  }
}
