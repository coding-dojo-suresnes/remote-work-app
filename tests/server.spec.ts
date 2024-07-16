import { mock } from 'jest-mock-extended';
import supertest from 'supertest';

import {
  IUserWorkSituationPort,
  RemoteWorkApp,
  UserWorkSituation,
} from '../src/domain';
import { RemoteWorkServer } from '../src/infra/adapter/remote-work-server';

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
  });
});
