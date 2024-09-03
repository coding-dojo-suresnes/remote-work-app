import { mock } from 'jest-mock-extended';

import { IUserWorkSituationPort } from './ports';
import { RemoteWorkApp } from './remote-work-app';
import { UserWeekPresence } from './user-presence.entity';
import { UserWorkSituation } from './user-work-situation.entity';
import { WeekDay, WeekDayEnum } from './week-day.entity';

describe('isUserInOffice', () => {
  const mockRepository = mock<IUserWorkSituationPort>();
  const remoteWorkApp = new RemoteWorkApp(mockRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should save an user presence on a Tuesday', async () => {
    const username = 'user';
    const date = new Date('2024-07-16T12:00:00.000Z');

    const workSituation = UserWorkSituation.IN_OFFICE;

    mockRepository.persistUserWeekPresence.mockResolvedValue(
      new UserWeekPresence(username),
    );
    const expectedPresence = new UserWeekPresence(username);
    expectedPresence.setPresence(
      new WeekDay(WeekDayEnum.Tuesday),
      UserWorkSituation.IN_OFFICE,
    );

    const response = (await remoteWorkApp.saveUserWorkSituation(
      username,
      date,
      workSituation,
    )) as any;

    expect(response.getUsername()).toBe(username); // TODO: check work situation as been set in good date
    expect(mockRepository.persistUserWeekPresence).toHaveBeenCalledWith(
      expectedPresence,
    );
  });
  it('should save a user presence on a Sunday', async () => {
    const username = 'user';
    const date = new Date('2024-07-14T12:00:00.000Z');

    const workSituation = UserWorkSituation.REMOTE;

    mockRepository.persistUserWeekPresence.mockResolvedValue(
      new UserWeekPresence(username),
    );
    const expectedPresence = new UserWeekPresence(username);
    expectedPresence.setPresence(
      new WeekDay(WeekDayEnum.Sunday),
      UserWorkSituation.REMOTE,
    );

    const response = (await remoteWorkApp.saveUserWorkSituation(
      username,
      date,
      workSituation,
    )) as any;

    expect(response.getUsername()).toBe(username); // TODO: check work situation as been set in good date
    expect(mockRepository.persistUserWeekPresence).toHaveBeenCalledWith(
      expectedPresence,
    );
  });
});
