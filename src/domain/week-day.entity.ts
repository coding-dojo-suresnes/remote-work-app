export enum WeekDayEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

export class WeekDay {
  constructor(private readonly day: WeekDayEnum) {}

  public toString(): string {
    switch (this.day) {
      case WeekDayEnum.Monday:
        return 'Monday';
      case WeekDayEnum.Tuesday:
        return 'Tuesday';
      case WeekDayEnum.Wednesday:
        return 'Wednesday';
      case WeekDayEnum.Thursday:
        return 'Thursday';
      case WeekDayEnum.Friday:
        return 'Friday';
      case WeekDayEnum.Saturday:
        return 'Saturday';
      default:
        return 'Sunday';
    }
  }

  public static fromDate(date: Date): WeekDay {
    let day = date.getDay();
    if (date.getDay() === 0) {
      day = WeekDayEnum.Sunday;
    }
    return new WeekDay(day);
  }
}
