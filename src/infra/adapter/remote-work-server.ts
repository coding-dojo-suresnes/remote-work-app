import { Server } from 'http';

import express, { Express } from 'express';

import { IRemoteWorkApp, UserWorkSituation } from '../../domain';

export class RemoteWorkServer {
  private server: Express;

  private httpServer!: Server;

  constructor(
    private readonly remoteWorkApp: IRemoteWorkApp,
    private readonly port = 3000,
  ) {
    this.server = express();
    this.setupRoutes();
  }

  getUserWorkSituation(
    username: string,
    date: Date,
  ): Promise<UserWorkSituation> {
    return this.remoteWorkApp.getUserWorkSituation(username, date);
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
