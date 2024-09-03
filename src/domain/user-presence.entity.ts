import { UserWorkSituation } from './user-work-situation.entity';
import { WeekDay } from './week-day.entity';

export class UserWeekPresence {
  userPresence: Map<WeekDay, UserWorkSituation> = new Map();

  getUsername(): string {
    return this.username;
  }

  getUserPresence(weekDay: WeekDay): UserWorkSituation {
    return this.userPresence.get(weekDay) || UserWorkSituation.NOT_DEFINED;
  }

  // TODO: make WeekDay as an objectValue instead of an enum
  setPresence(weekDay: WeekDay, presence: UserWorkSituation): void {
    this.userPresence.set(weekDay, presence);
  }

  constructor(private username: string) {}
}
