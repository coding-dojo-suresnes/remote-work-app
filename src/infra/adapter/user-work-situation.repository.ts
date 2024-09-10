import {
  IUserWorkSituationPort,
  UserWeekPresence,
  UserWorkSituation,
} from '../../domain';
import { WeekDay } from '../../domain/week-day.entity';

export class UserWorkSituationRepository implements IUserWorkSituationPort {
  private usersWeek: Map<string, UserWeekPresence> = new Map();

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    const day = WeekDay.fromDate(date);
    const userPresence = this.usersWeek.get(username)?.getUserPresence(day);
    return Promise.resolve(userPresence ?? UserWorkSituation.NOT_DEFINED);
  }

  persistUserWeekPresence(
    userWeekPresence: UserWeekPresence,
  ): Promise<UserWeekPresence> {
    this.usersWeek.set(userWeekPresence.getUsername(), userWeekPresence);
    return Promise.resolve(userWeekPresence);
  }
}
