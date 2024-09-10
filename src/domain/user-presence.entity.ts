import { UserWorkSituation } from './user-work-situation.entity';
import { WeekDay } from './week-day.entity';

export class UserWeekPresence {
  userPresence: Map<string, UserWorkSituation> = new Map();

  constructor(private username: string) {}

  getUsername(): string {
    return this.username;
  }

  getUserPresence(weekDay: WeekDay): UserWorkSituation {
    return (
      this.userPresence.get(weekDay.toString()) || UserWorkSituation.NOT_DEFINED
    );
  }

  setPresence(weekDay: WeekDay, presence: UserWorkSituation): void {
    this.userPresence.set(weekDay.toString(), presence);
  }
}
