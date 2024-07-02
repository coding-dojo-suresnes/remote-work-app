import { IRemoteWorkApp, IUserWorkSituationPort } from './ports';
import { UserWorkSituation } from './user-work-situation.entity';

export class RemoteWorkApp implements IRemoteWorkApp {
  constructor(private readonly userPresencePort: IUserWorkSituationPort) {}

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
