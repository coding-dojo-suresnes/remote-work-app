/* eslint-disable max-lines-per-function */
import { Server } from 'http';

import bodyParser from 'body-parser';
import express, { Express, NextFunction, Response } from 'express';
import { ZodError } from 'zod';

import {
  IRemoteWorkApp,
  UserNotFoundError,
  UserPresence,
  UserWorkSituation,
  userWorkSituationFromString,
} from '../../domain';
import { UserEntity } from '../../domain/user.entity';
import { getUserPresenceQuerySchema, postUserPresenceBodySchema } from './dto';
import { getUserByIdQuerySchema } from './dto/get-user-by-id-query.dto';
import { postUserBodySchema } from './dto/post-user-body.dto';

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
    this.server.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error: unknown, _req: unknown, res: Response, _next: NextFunction) => {
        if (error) {
          if (error instanceof Error) {
            res.status(500).json({ error: error.toString() });
          }
          console.error('Middleware caught somehting that is not an error');
          try {
            const stringified = JSON.stringify(error);
            console.error('Error = ', stringified);
          } catch (err) {
            console.error(
              'could not stringify error: ',
              error,
              ' with error: ',
              err,
            );
          }
        }
      },
    );
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

  saveUser(
    username: string,
    firstName?: string,
    lastName?: string,
  ): Promise<UserEntity> {
    return this.remoteWorkApp.saveUser(username, firstName, lastName);
  }

  getAllUsers(): Promise<{ users: UserEntity[]; count: number }> {
    return this.remoteWorkApp.getAllUsers();
  }

  setupRoutes(): void {
    this.server.get('/user-presence', async (req, res) => {
      try {
        const { username, date } = getUserPresenceQuerySchema.parse(req.query);
        const workSituation = await this.getUserWorkSituation(
          username,
          new Date(date),
        );
        res.json({
          workSituation,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error });
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
        res.json({ workSituation: workSituation.toObject() });
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error });
        }
        if (error instanceof UserNotFoundError) {
          res.status(400).json({ error });
        }
      }
    });
    this.server.post('/users', async (req, res) => {
      try {
        const body = postUserBodySchema.parse(req.body);

        const user = await this.saveUser(
          body.username,
          body.firstName,
          body.lastName,
        );
        res.json({ user: user.toObject() });
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error });
        }
        throw error;
      }
    });
    this.server.get('/users', async (req, res) => {
      try {
        const result = await this.getAllUsers();
        res.json(result);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error });
        }
        throw error;
      }
    });
    this.server.get('/users/:id', async (req, res) => {
      try {
        const query = getUserByIdQuerySchema.parse(req.params);

        const user = await this.remoteWorkApp.getUser(query.id);

        if (user) {
          res.json({ user: user.toObject() });
        }
        res.sendStatus(404);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error });
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
