import { mock } from 'jest-mock-extended';
import supertest from 'supertest';

import {
  IUserWorkSituationPort,
  RemoteWorkApp,
  UserPresence,
  UserWorkSituation,
} from '../src/domain';
import { DayDate } from '../src/domain/day-date.entity';
import { RemoteWorkServer } from '../src/infra/adapter/server';

describe('Rest API server', () => {
  const repoMock = mock<IUserWorkSituationPort>();
  const app = new RemoteWorkServer(new RemoteWorkApp(repoMock));
  afterEach(() => {
    app.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should get an 404 error if the url requested doest not exist', async () => {
    const server = app.start();

    await supertest(server).get('/error-404').expect(404);
  });
  describe('/user-presence', () => {
    it('should return a IN_OFFICE when user is in office', async () => {
      const server = app.start();
      repoMock.getUserWorkSituation.mockResolvedValueOnce(
        UserWorkSituation.IN_OFFICE,
      );

      const response = await supertest(server).get(
        '/user-presence?username=wayglem&date=2020-02-02',
      );

      expect(response.body).toEqual({ workSituation: 'IN_OFFICE' });
      expect(response.status).toBe(200);
    });

    it('should return a REMOTE when user is remote', async () => {
      const server = app.start();
      repoMock.getUserWorkSituation.mockResolvedValueOnce(
        UserWorkSituation.REMOTE,
      );

      const response = await supertest(server).get(
        '/user-presence?username=wayglem&date=2020-02-02',
      );

      expect(response.body).toEqual({ workSituation: 'REMOTE' });
      expect(response.status).toBe(200);
    });

    it('should save a day of presence', async () => {
      // FIXME: this test is not validating anything
      const server = app.start();
      const date = new DayDate(1, 6, 2024);
      repoMock.persistUserWeekPresence.mockResolvedValueOnce(
        new UserPresence('elias', date, UserWorkSituation.IN_OFFICE),
      );

      const response = await supertest(server)
        .post('/user-presence')
        .send(
          JSON.stringify({
            username: 'elias',
            date: '2024-06-01',
            situation: 'IN_OFFICE',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        workSituation: {
          day: '2024-06-01',
          presence: 'IN_OFFICE',
          username: 'elias',
        },
      });
    });
  });
});
