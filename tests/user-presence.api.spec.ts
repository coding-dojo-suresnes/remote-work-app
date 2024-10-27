import supertest from 'supertest';

import {
  IUserWorkSituationPort,
  RemoteWorkApp,
  UserPresence,
  UserWorkSituation,
} from '../src/domain';
import { DayDate } from '../src/domain/day-date.entity';
import { IUserPort } from '../src/domain/ports/output/user.port';
import { UserEntity } from '../src/domain/user.entity';
import { RemoteWorkServer } from '../src/infra/adapter/server';
import { UserWorkSituationRepository } from '../src/infra/adapter/user-work-situation.repository';
import { UserRepository } from '../src/infra/adapter/user.repository';

describe('User Presence API', () => {
  let userWorkSituationRepository: IUserWorkSituationPort;
  let userRepository: IUserPort;
  let app: RemoteWorkServer;
  afterEach(() => {
    app.stop();
  });

  beforeEach(() => {
    userRepository = new UserRepository();
    userWorkSituationRepository = new UserWorkSituationRepository();
    app = new RemoteWorkServer(
      new RemoteWorkApp(userWorkSituationRepository, userRepository),
    );
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('GET /user-presence', () => {
    it('should return a IN_OFFICE when user is in office', async () => {
      const server = app.start();
      userWorkSituationRepository.persistUserWeekPresence(
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
      userWorkSituationRepository.persistUserWeekPresence(
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
    it('should return an error when user does not exist', async () => {
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

      expect(response.status).toBe(400);
    });
    it('should save a day of presence', async () => {
      const server = app.start();
      const user = new UserEntity('wayglem');
      user.firstName = 'firstName';
      user.lastName = 'lastName';
      userRepository.persistUser(user);
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
      const user = new UserEntity('wayglem');
      user.firstName = 'firstName';
      user.lastName = 'lastName';
      userRepository.persistUser(user);

      userWorkSituationRepository.persistUserWeekPresence(
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
