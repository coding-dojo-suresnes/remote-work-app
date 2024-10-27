export class DayDate {
  public constructor(
    public readonly day: number,
    public readonly month: number,
    public readonly year: number,
  ) {
    if (this.isInvalidDate()) {
      throw new Error('Invalid date');
    }
  }

  private isInvalidDate(): boolean {
    const date = new Date(this.toString());
    return !(
      date.getDate() === this.day &&
      date.getMonth() === this.month - 1 &&
      date.getFullYear() === this.year &&
      !Number.isNaN(date.getTime())
    );
  }

  public toString(): string {
    const month = this.month.toString().padStart(2, '0');
    const day = this.day.toString().padStart(2, '0');
    const year = this.year.toString().padStart(4, '0');
    return `${year}-${month}-${day}`;
  }

  public toStartOfDayZulu(): Date {
    return new Date(`${this.toString()}T00:00:00.000Z`);
  }

  public toEndOfDayZulu(): Date {
    return new Date(`${this.toString()}T23:59:59.999Z`);
  }

  public isBeforeOrEqual(date: DayDate): boolean {
    return this.toStartOfDayZulu() <= date.toStartOfDayZulu();
  }

  public isBefore(date: DayDate): boolean {
    return this.toStartOfDayZulu() < date.toStartOfDayZulu();
  }

  public static fromISOZuluString(date: string): DayDate {
    const dayDate = DayDate.fromDate(new Date(date));
    if (dayDate.toString() !== date.split('T')[0]) {
      throw new Error('Invalid date');
    }
    return dayDate;
  }

  public static fromDate(date: Date): DayDate {
    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    const [year, month, day] = date
      .toISOString()
      .split('T')[0]
      .split('-')
      .map(Number);
    return new DayDate(day, month, year);
  }
}
