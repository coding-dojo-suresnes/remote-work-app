import { mock } from 'jest-mock-extended';

import { DayDate } from './day-date.entity';
import { IUserWorkSituationPort } from './ports';
import { RemoteWorkApp } from './remote-work-app';
import { UserPresence } from './user-presence.entity';
import { UserWorkSituation } from './user-work-situation.entity';

describe('isUserInOffice', () => {
  const mockRepository = mock<IUserWorkSituationPort>();
  const remoteWorkApp = new RemoteWorkApp(mockRepository);

  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should save an user presence on a Tuesday', async () => {
    const username = 'user';
    const date = new DayDate(16, 7, 2024);
    const workSituation = UserWorkSituation.IN_OFFICE;

    mockRepository.persistUserWeekPresence.mockResolvedValue(
      new UserPresence(username, date, workSituation),
    );
    const expectedPresence = new UserPresence(username, date, workSituation);

    const response = await remoteWorkApp.saveUserWorkSituation(
      username,
      date.toString(),
      workSituation,
    );

    expect(response.username).toBe(username);
    expect(response.dayDate).toBe(date);
    expect(mockRepository.persistUserWeekPresence).toHaveBeenCalledWith(
      expectedPresence,
    );
  });
});
