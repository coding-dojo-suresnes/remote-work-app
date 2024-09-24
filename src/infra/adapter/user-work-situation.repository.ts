import {
  IUserWorkSituationPort,
  UserPresence,
  UserWorkSituation,
} from '../../domain';
import { DayDate } from '../../domain/day-date.entity';

export class UserWorkSituationRepository implements IUserWorkSituationPort {
  private usersWeek: Map<string, Map<string, UserPresence>> = new Map();

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    const day = DayDate.fromDate(date);
    const userPresence = this.usersWeek.get(username)?.get(day.toString());
    return Promise.resolve(
      userPresence?.presence ?? UserWorkSituation.NOT_DEFINED,
    );
  }

  persistUserWeekPresence(userPresence: UserPresence): Promise<UserPresence> {
    let map = this.usersWeek.get(userPresence.username);
    if (!map) {
      map = new Map<string, UserPresence>();
    }
    map.set(userPresence.dayDate.toString(), userPresence);
    this.usersWeek.set(userPresence.username, map);
    return Promise.resolve(userPresence);
  }
}
