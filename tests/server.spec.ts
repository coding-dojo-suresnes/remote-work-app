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

describe('Rest API server', () => {
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

  it('should get an 404 error if the url requested doest not exist', async () => {
    const server = app.start();

    await supertest(server).get('/error-404').expect(404);
  });
  describe('POST /users', () => {
    it('should return a 400 error when request body is not valid', async () => {
      const server = app.start();

      const response = await supertest(server)
        .post('/users')
        .send(
          JSON.stringify({
            firstName: 'wayglem',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
    });
    it('should create a user', async () => {
      const server = app.start();

      const response = await supertest(server)
        .post('/users')
        .send(
          JSON.stringify({
            username: 'wayglem',
            firstName: 'me',
            lastName: 'again',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.body.user).toBeDefined();
      const { user } = response.body;
      expect(user.username).toEqual('wayglem');
      expect(user.firstName).toEqual('me');
      expect(user.lastName).toEqual('again');
      expect(response.status).toBe(200);
    });
    it('should update a user when posting a user with an existing username', async () => {
      const server = app.start();
      const oldUser = new UserEntity('wayglem');
      oldUser.firstName = 'old first';
      oldUser.lastName = 'old last';
      userRepository.persistUser(oldUser);
      const old = userRepository.getUserByUsername('wayglem');

      const response = await supertest(server)
        .post('/users')
        .send(
          JSON.stringify({
            username: 'wayglem',
            firstName: 'another me',
            lastName: 'another me last',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.body.user).toBeDefined();
      const { user } = response.body;
      expect(user.username).toEqual('wayglem');
      expect(user.firstName).toEqual('another me');
      expect(user.lastName).toEqual('another me last');
      expect(user).not.toStrictEqual(old?.toObject());
      expect(response.status).toBe(200);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a 404 error when user does not exist', async () => {
      const server = app.start();

      const response = await supertest(server).get('/users/123');

      expect(response.status).toBe(404);
    });

    it('should return user info when user exists', async () => {
      const server = app.start();
      const user = new UserEntity('wayglem');
      user.firstName = 'firstName';
      user.lastName = 'lastName';
      userRepository.persistUser(user);

      const response = await supertest(server).get(`/users/${user.id.value}`);

      expect(response.status).toBe(200);
    });
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

  describe('GET /users', () => {
    it('should get all users when users are found', async () => {
      const server = app.start();
      const user1 = new UserEntity('wayglem1');
      const user2 = new UserEntity('wayglem2');
      userRepository.persistUser(user1);
      userRepository.persistUser(user2);

      const response = await supertest(server).get('/users');

      expect(response.body).toEqual({ users: [user1, user2], count: 2 });
      expect(response.status).toBe(200);
    });
    it('should get empty array when no users are found', async () => {
      const server = app.start();
      const response = await supertest(server).get('/users');

      expect(response.body).toEqual({ users: [], count: 0 });
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
