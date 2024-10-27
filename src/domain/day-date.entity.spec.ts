import { DayDate } from './day-date.entity';

describe('DayDate', () => {
  describe('constructor', () => {
    it('should create a valid date and stringify it', () => {
      const dayDate = new DayDate(13, 5, 2024);
      expect(dayDate.toString()).toBe('2024-05-13');
    });
    it('should throw an error when date is invalid', () => {
      expect(() => new DayDate(30, 2, 2024)).toThrow('Invalid date');
      expect(() => new DayDate(29, 2, 2023)).toThrow('Invalid date');
      expect(() => new DayDate(31, 4, 2025)).toThrow('Invalid date');
      expect(() => new DayDate(0, 1, 2025)).toThrow('Invalid date');
      expect(() => new DayDate(5, 0, 2025)).toThrow('Invalid date');
      expect(() => new DayDate(5, 0, -31)).toThrow('Invalid date');
    });
  });
  describe('toStartOfDayZulu', () => {
    it('should return the start of the day in Zulu time', () => {
      const dayDate = new DayDate(27, 10, 2024);
      expect(dayDate.toStartOfDayZulu().toISOString()).toBe(
        '2024-10-27T00:00:00.000Z',
      );
    });
  });
  describe('toEndOfDayZulu', () => {
    it('should return the end of the day in Zulu time', () => {
      const dayDate = new DayDate(27, 10, 2024);
      expect(dayDate.toEndOfDayZulu().toISOString()).toBe(
        '2024-10-27T23:59:59.999Z',
      );
    });
  });
  describe('isBefore', () => {
    it('should true when is before another day', () => {
      const firstDayDate = new DayDate(27, 10, 2024);
      const secondDayDate = new DayDate(28, 10, 2024);
      expect(firstDayDate.isBefore(secondDayDate)).toBe(true);
      const firstDayDate2 = new DayDate(30, 12, 2024);
      const secondDayDate2 = new DayDate(1, 1, 2025);
      expect(firstDayDate2.isBefore(secondDayDate2)).toBe(true);
      const firstDayDate3 = new DayDate(13, 2, 2024);
      const secondDayDate3 = new DayDate(5, 1, 2025);
      expect(firstDayDate3.isBefore(secondDayDate3)).toBe(true);
    });
    it('should false when is same day', () => {
      const firstDayDate = new DayDate(27, 10, 2024);
      const secondDayDate = new DayDate(27, 10, 2024);
      expect(firstDayDate.isBefore(secondDayDate)).toBe(false);
      expect(firstDayDate.isBeforeOrEqual(secondDayDate)).toBe(true);
    });
  });
  describe('fromISOZuluString', () => {
    it('should create a DayDate from an ISO-8601 representation with Zulu timezone', () => {
      const dayDate = DayDate.fromISOZuluString('2024-10-27T00:00:00.000Z');
      expect(dayDate.toString()).toBe('2024-10-27');
    });
    it('should throw an error when string is invalid date', () => {
      expect(() => DayDate.fromISOZuluString('invalid string')).toThrow(
        'Invalid date',
      );
      expect(() =>
        DayDate.fromISOZuluString('2024-02-30T00:00:00.000Z'),
      ).toThrow('Invalid date');
    });
  });
  describe('fromDate', () => {
    it('should create a DayDate from a Date object', () => {
      expect(
        DayDate.fromDate(new Date('2024-10-27T23:50:00.000Z')).toString(),
      ).toBe('2024-10-27');
      expect(
        DayDate.fromDate(new Date('2024-10-27T23:50:00.000Z')).toString(),
      ).toBe('2024-10-27');
    });
    it('should throw an error when date is invalid', () => {
      expect(() =>
        DayDate.fromDate(new Date('2024-42-01T00:00:00.000Z')),
      ).toThrow('Invalid date');
      expect(() => DayDate.fromDate(new Date(''))).toThrow('Invalid date');
    });
  });
});
