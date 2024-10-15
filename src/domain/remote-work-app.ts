import { DayDate } from './day-date.entity';
import { IRemoteWorkApp, IUserWorkSituationPort } from './ports';
import { IUserPort } from './ports/output/user.port';
import { UserId } from './user-id.value-object';
import { UserPresence } from './user-presence.entity';
import { UserWorkSituation } from './user-work-situation.entity';
import { UserEntity } from './user.entity';

export class RemoteWorkApp implements IRemoteWorkApp {
  constructor(
    private readonly userPresenceRepository: IUserWorkSituationPort,
    private readonly userRepository: IUserPort,
  ) {}

  saveUser(
    username: string,
    firstName?: string,
    lastName?: string,
  ): Promise<UserEntity> {
    const newUser = new UserEntity(username);
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    this.userRepository.persistUser(newUser);
    return Promise.resolve(newUser);
  }

  getUser(id: string): Promise<UserEntity | null> {
    return Promise.resolve(this.userRepository.getUserById(new UserId(id)));
  }

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return this.userPresenceRepository.getUserWorkSituation(username, date);
  }

  public async saveUserWorkSituation(
    username: string,
    date: string,
    workSituation: UserWorkSituation,
  ): Promise<UserPresence> {
    const userWeekPresence = new UserPresence(
      username,
      DayDate.fromISOZuluString(date),
      workSituation,
    );

    return this.userPresenceRepository.persistUserWeekPresence(
      userWeekPresence,
    );
  }

  public async isUserInOffice(username: string, date: Date): Promise<boolean> {
    const workSituation: UserWorkSituation =
      await this.userPresenceRepository.getUserWorkSituation(username, date);
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
