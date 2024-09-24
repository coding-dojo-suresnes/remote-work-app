import { Server } from 'http';

import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { ZodError } from 'zod';

import {
  IRemoteWorkApp,
  UserPresence,
  UserWorkSituation,
  userWorkSituationFromString,
} from '../../domain';
import { getUserPresenceQuerySchema, postUserPresenceBodySchema } from './dto';

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
    date: string,
    situation: UserWorkSituation,
  ): Promise<UserPresence> {
    return this.remoteWorkApp.saveUserWorkSituation(username, date, situation);
  }

  setupRoutes(): void {
    this.server.get('/user-presence', async (req, res) => {
      try {
        const { username, date } = getUserPresenceQuerySchema.parse(req.query);

        const workSituation = await this.getUserWorkSituation(
          username,
          new Date(date),
        );
        return res.json({
          workSituation,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ error });
        }
        throw error;
      }
    });
    this.server.post('/user-presence', async (req, res) => {
      try {
        const myBody = postUserPresenceBodySchema.parse(req.body);
        const workSituation = await this.saveUserWorkSituation(
          myBody.username,
          myBody.date,
          userWorkSituationFromString(myBody.situation),
        );
        return res.json({ workSituation: workSituation.toObject() });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({ error });
        }
        throw error;
      }
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
