import { Server } from 'http';

import bodyParser from 'body-parser';
import express, { Express } from 'express';

import {
  IRemoteWorkApp,
  UserWeekPresence,
  UserWorkSituation,
  userWorkSituationFromString,
} from '../../domain';

export class RemoteWorkServer {
  private server: Express;

  private httpServer!: Server;

  constructor(
    private readonly remoteWorkApp: IRemoteWorkApp,
    private readonly port = 3000,
  ) {
    this.server = express();
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.setupRoutes();
  }

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return this.remoteWorkApp.getUserWorkSituation(username, date);
  }

  saveUserWorkSituation(
    username: string,
    date: Date,
    situation: UserWorkSituation,
  ): Promise<UserWeekPresence> {
    return this.remoteWorkApp.saveUserWorkSituation(username, date, situation);
  }

  setupRoutes(): void {
    this.server.get('/user-presence', async (req, res) => {
      // TODO: validate request DTO
      const { username, date } = req.query as any;

      const workSituation = await this.getUserWorkSituation(
        username,
        new Date(date),
      );
      return res.json({
        workSituation,
      });
    });
    this.server.post('/user-presence', async (req, res) => {
      // TODO: validate request DTO
      const myBody: { username: string; date: string; situation: string } =
        req.body;
      const workSituation = await this.saveUserWorkSituation(
        myBody.username,
        new Date(myBody.date),
        userWorkSituationFromString(myBody.situation),
      );
      res.json({ workSituation });
    });
  }

  stop(): void {
    this.httpServer?.close();
  }

  start(): Express {
    this.httpServer = this.server.listen(this.port, () => {
      console.log(`RWA is running on port ${this.port}`);
    });
    return this.server;
  }
}
