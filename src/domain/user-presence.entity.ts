import { DayDate } from './day-date.entity';
import { UserWorkSituation } from './user-work-situation.entity';

export class UserPresence {
  constructor(
    private readonly _username: string,
    private readonly _dayDate: DayDate,
    private readonly _presence: UserWorkSituation = UserWorkSituation.NOT_DEFINED,
  ) {}

  public get username(): string {
    return this._username;
  }

  public get presence(): UserWorkSituation {
    return this._presence;
  }

  public get dayDate(): DayDate {
    return this._dayDate;
  }

  public toObject(): {
    username: string;
    presence: UserWorkSituation;
    day: string;
  } {
    return {
      username: this._username,
      presence: this._presence,
      day: this._dayDate.toString(),
    };
  }
}
