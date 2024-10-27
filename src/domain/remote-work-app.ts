import { DayDate } from './day-date.entity';
import { UserNotFoundError } from './errors';
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
    const user = this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new UserNotFoundError();
    }
    const userWeekPresence = new UserPresence(
      username,
      DayDate.fromISOZuluString(date),
      workSituation,
    );

    return this.userPresenceRepository.persistUserWeekPresence(
      userWeekPresence,
    );
  }

  public async getAllUsers(): Promise<{ users: UserEntity[]; count: number }> {
    const users = await this.userRepository.getAll();
    return { users, count: users.length };
  }
}
