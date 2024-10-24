import supertest from 'supertest';

import { RemoteWorkApp } from '../src/domain';
import { IUserPort } from '../src/domain/ports/output/user.port';
import { UserEntity } from '../src/domain/user.entity';
import { RemoteWorkServer } from '../src/infra/adapter/server';
import { UserWorkSituationRepository } from '../src/infra/adapter/user-work-situation.repository';
import { UserRepository } from '../src/infra/adapter/user.repository';

describe('Rest API server', () => {
  let app: RemoteWorkServer;
  let userRepo: IUserPort;

  beforeEach(() => {
    const repo = new UserWorkSituationRepository();
    userRepo = new UserRepository();
    app = new RemoteWorkServer(new RemoteWorkApp(repo, userRepo));
  });

  afterEach(() => {
    app.stop();
  });

  describe('/user-presence', () => {
    it('should save a user presence and retrieve it', async () => {
      const server = app.start();
      userRepo.persistUser(new UserEntity('wayglem'));
      await supertest(server)
        .post('/user-presence')
        .send(
          JSON.stringify({
            username: 'wayglem',
            date: '2024-06-01',
            situation: 'IN_OFFICE',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      const response = await supertest(server)
        .get('/user-presence')
        .query({ username: 'wayglem', date: '2024-06-01' });

      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ workSituation: 'IN_OFFICE' });
    });
    it('should retrieve NOT_DEFINED when no presence was set', async () => {
      const server = app.start();

      const response = await supertest(server)
        .get('/user-presence')
        .query({ username: 'wayglem', date: '2024-06-01' });

      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ workSituation: 'NOT_DEFINED' });
    });

    it('should return 400 if date and username is not valid when getting user presence', async () => {
      const server = app.start();

      const response = await supertest(server)
        .get('/user-presence')
        .query({ username: 123, date: '2024-ab-01' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if situation is incorrect when setting user presence', async () => {
      const server = app.start();

      const response = await supertest(server).post('/user-presence').send({
        username: 'toto',
        date: '2024-02-01',
        situation: 'incorrect_situation',
      });

      expect(response.status).toBe(400);
    });
  });
});
