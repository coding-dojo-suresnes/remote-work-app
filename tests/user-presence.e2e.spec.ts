import supertest from 'supertest';

import { RemoteWorkApp } from '../src/domain';
import { RemoteWorkServer } from '../src/infra/adapter/server';
import { UserWorkSituationRepository } from '../src/infra/adapter/user-work-situation.repository';

describe('Rest API server', () => {
  let app: RemoteWorkServer;

  beforeEach(() => {
    const repo = new UserWorkSituationRepository();
    app = new RemoteWorkServer(new RemoteWorkApp(repo));
  });

  afterEach(() => {
    app.stop();
  });

  describe('/user-presence', () => {
    it('should save a user presence and retrieve it', async () => {
      const server = app.start();
      await supertest(server)
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

      const response = await supertest(server)
        .get('/user-presence')
        .query({ username: 'elias', date: '2024-06-01' });

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
        .query({ username: 'elias', date: '2024-06-01' });

      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8',
      );
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ workSituation: 'NOT_DEFINED' });
    });
  });
});
