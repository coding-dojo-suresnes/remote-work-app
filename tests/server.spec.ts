import supertest from 'supertest';

import { RemoteWorkApp, UserPresence, UserWorkSituation } from '../src/domain';
import { DayDate } from '../src/domain/day-date.entity';
import { RemoteWorkServer } from '../src/infra/adapter/server';
import { UserWorkSituationRepository } from '../src/infra/adapter/user-work-situation.repository';

describe('Rest API server', () => {
  const repository = new UserWorkSituationRepository();
  const app = new RemoteWorkServer(new RemoteWorkApp(repository));
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
  describe('GET /user-presence', () => {
    it('should return a IN_OFFICE when user is in office', async () => {
      const server = app.start();
      repository.persistUserWeekPresence(
        new UserPresence(
          'wayglem',
          new DayDate(2, 2, 2020),
          UserWorkSituation.IN_OFFICE,
        ),
      );

      const response = await supertest(server).get(
        '/user-presence?username=wayglem&date=2020-02-02',
      );

      expect(response.body).toEqual({ workSituation: 'IN_OFFICE' });
      expect(response.status).toBe(200);
    });

    it('should return a REMOTE when user is remote', async () => {
      const server = app.start();
      repository.persistUserWeekPresence(
        new UserPresence(
          'wayglem',
          new DayDate(2, 2, 2020),
          UserWorkSituation.REMOTE,
        ),
      );

      const response = await supertest(server).get(
        '/user-presence?username=wayglem&date=2020-02-02',
      );

      expect(response.body).toEqual({ workSituation: 'REMOTE' });
      expect(response.status).toBe(200);
    });
  });

  describe('POST /user-presence', () => {
    it('should save a day of presence', async () => {
      const server = app.start();
      const date = new DayDate(1, 6, 2024);

      const response = await supertest(server)
        .post('/user-presence')
        .send(
          JSON.stringify({
            username: 'wayglem',
            date: date.toString(),
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
          username: 'wayglem',
        },
      });
    });

    it('should update presence when post a new presence on the same day', async () => {
      const server = app.start();
      const date = new DayDate(1, 6, 2024);
      repository.persistUserWeekPresence(
        new UserPresence('wayglem', date, UserWorkSituation.IN_OFFICE),
      );

      const beforeUpdate = await supertest(server).get(
        `/user-presence?username=wayglem&date=${date.toString()}`,
      );

      await supertest(server)
        .post('/user-presence')
        .send(
          JSON.stringify({
            username: 'wayglem',
            date: date.toString(),
            situation: 'REMOTE',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const afterUpdate = await supertest(server).get(
        `/user-presence?username=wayglem&date=${date.toString()}`,
      );

      expect(beforeUpdate.body).toEqual({
        workSituation: 'IN_OFFICE',
      });
      expect(afterUpdate.body).toEqual({
        workSituation: 'REMOTE',
      });
    });
  });
});
