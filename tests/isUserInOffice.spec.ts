import { mock } from 'jest-mock-extended';

import {
  IRemoteWorkApp,
  IUserWorkSituationPort,
  RemoteWorkApp,
  UserWorkSituation,
} from '../src/domain';
import { IUserPort } from '../src/domain/ports/output/user.port';

describe('isUserInOffice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return true when user is in-office this day', async () => {
    // arrange
    const userPresencePort = mock<IUserWorkSituationPort>();
    const userRepositoryMock = mock<IUserPort>();
    userPresencePort.getUserWorkSituation.mockResolvedValueOnce(
      UserWorkSituation.IN_OFFICE,
    );
    const remoteWorkApp: IRemoteWorkApp = new RemoteWorkApp(
      userPresencePort,
      userRepositoryMock,
    );
    const today = new Date();
    // act
    const inOffice = await remoteWorkApp.isUserInOffice('Elias', today);
    // assert
    expect(inOffice).toBe(true);
  });
  it('should return false when user not in office this day', async () => {
    // arrange
    const userPresencePort = mock<IUserWorkSituationPort>();
    const userRepositoryMock = mock<IUserPort>();

    const remoteWorkApp: IRemoteWorkApp = new RemoteWorkApp(
      userPresencePort,
      userRepositoryMock,
    );
    // given user is not in office
    userPresencePort.getUserWorkSituation.mockResolvedValue(
      UserWorkSituation.REMOTE,
    );
    const today = new Date();
    // act
    const inOffice = await remoteWorkApp.isUserInOffice('Elias', today);
    // assert
    expect(inOffice).toBe(false);
  });

  it('should return false when user not in office this day', async () => {
    // arrange
    const userPresencePort = mock<IUserWorkSituationPort>();
    const userRepositoryMock = mock<IUserPort>();

    const remoteWorkApp: IRemoteWorkApp = new RemoteWorkApp(
      userPresencePort,
      userRepositoryMock,
    );
    // given user is not in office
    userPresencePort.getUserWorkSituation.mockResolvedValueOnce(
      UserWorkSituation.REMOTE,
    );
    userPresencePort.getUserWorkSituation.mockResolvedValueOnce(
      UserWorkSituation.IN_OFFICE,
    );
    const today = new Date('2024-01-02');
    const yesterday = new Date('2024-01-01');
    const user = 'Elias';
    // act
    const inOfficeToday = await remoteWorkApp.isUserInOffice(user, today);
    const inOfficeYesterday = await remoteWorkApp.isUserInOffice(
      user,
      yesterday,
    );
    // assert
    expect(inOfficeToday).toBe(false);
    expect(inOfficeYesterday).toBe(true);
    expect(userPresencePort.getUserWorkSituation).toHaveBeenCalledTimes(2);
    expect(userPresencePort.getUserWorkSituation).toHaveBeenCalledWith(
      user,
      today,
    );
    expect(userPresencePort.getUserWorkSituation).toHaveBeenCalledWith(
      user,
      yesterday,
    );
  });

  it('should throw an error when user Presence is undefined', async () => {
    // arrange
    const userPresencePort = mock<IUserWorkSituationPort>();
    const userRepositoryMock = mock<IUserPort>();

    const remoteWorkApp: IRemoteWorkApp = new RemoteWorkApp(
      userPresencePort,
      userRepositoryMock,
    );
    const today = new Date();

    expect(async () => {
      await remoteWorkApp.isUserInOffice('Elias', today);
    }).rejects.toThrow(Error);
  });
});
