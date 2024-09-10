import {
  IUserWorkSituationPort,
  UserWeekPresence,
  UserWorkSituation,
} from '../../domain';
import { WeekDay } from '../../domain/week-day.entity';

export class UserWorkSituationRepository implements IUserWorkSituationPort {
  private users: Map<string, Map<Date, UserWorkSituation>> = new Map();

  private usersWeek: Map<string, UserWeekPresence> = new Map();

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    const day = WeekDay.fromDate(date);
    const userPresence = this.usersWeek.get(username)?.getUserPresence(day);
    return Promise.resolve(userPresence ?? UserWorkSituation.NOT_DEFINED);
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

  persistUserWeekPresence(
    userWeekPresence: UserWeekPresence,
  ): Promise<UserWeekPresence> {
    this.usersWeek.set(userWeekPresence.getUsername(), userWeekPresence);
    return Promise.resolve(userWeekPresence);
  }
}
