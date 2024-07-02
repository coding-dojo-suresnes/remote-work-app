import { Server } from 'http';

import express, { Express } from 'express';

import { IRemoteWorkApp, UserWorkSituation } from '../../domain';

export class RemoteWorkServer implements IRemoteWorkApp {
  private server: Express;

  private httpServer!: Server;

  constructor(private readonly port = 3000) {
    this.server = express();
    this.setupRoutes();
  }

  isUserInOffice(username: string, date: Date): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return Promise.resolve(UserWorkSituation.IN_OFFICE);
  }

  setupRoutes(): void {
    this.server.get('/user-presence', async (req, res) => {
      const workSituation = await this.getUserWorkSituation('', new Date());
      return res.json({
        workSituation,
      });
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
