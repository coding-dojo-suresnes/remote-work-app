import { mock } from 'jest-mock-extended';
import supertest from 'supertest';

import {
  IUserWorkSituationPort,
  RemoteWorkApp,
  UserWeekPresence,
  UserWorkSituation,
} from '../src/domain';
import { RemoteWorkServer } from '../src/infra/adapter/server';

describe('Rest API server', () => {
  const repoMock = mock<IUserWorkSituationPort>();
  const app = new RemoteWorkServer(new RemoteWorkApp(repoMock));
  afterEach(() => {
    app.stop();
  });

  it('should get an 404 error if the url requested doest not exist', (done) => {
    const server = app.start();

    supertest(server)
      .get('/error-404')
      .expect(404)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .end((err) => done(err));
  });
  describe('/user-presence', () => {
    it('should return a IN_OFFICE when user is in office', () => {
      const server = app.start();
      repoMock.getUserWorkSituation.mockResolvedValueOnce(
        UserWorkSituation.IN_OFFICE,
      );

      supertest(server)
        .get('/user-presence?username=wayglem')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ workSituation: 'IN_OFFICE' });
        });
    });

    it('should return a REMOTE when user is remote', () => {
      const server = app.start();
      repoMock.getUserWorkSituation.mockResolvedValueOnce(
        UserWorkSituation.REMOTE,
      );

      supertest(server)
        .get('/user-presence?username=wayglem')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ workSituation: 'REMOTE' });
        });
    });

    it('should save a day of presence', (done) => {
      // FIXME: this test is not validating anything
      const server = app.start();
      repoMock.persistUserWeekPresence.mockResolvedValueOnce(
        new UserWeekPresence('elias'),
      );

      supertest(server)
        .post('/user-presence')
        .send(
          JSON.stringify({
            username: 'elias',
            date: '2024-06-01',
            situation: 'IN_OFFICE',
          }),
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            workSituation: {
              userPresence: {},
              username: 'elias',
            },
          });
          done();
        });
    });
  });
});
