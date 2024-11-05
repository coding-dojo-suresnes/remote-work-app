/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
import { Server } from 'http';

import bodyParser from 'body-parser';
import sqlite3 from 'connect-sqlite3';
import express, { Express, NextFunction, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oidc';
import { ZodError } from 'zod';
import { fromError } from 'zod-validation-error';

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

const SQLiteStore = sqlite3(session);

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
    this.server.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'sessions.db', dir: '/tmp' }),
      }),
    );
    this.server.use(passport.authenticate('session'));

    this.setupGoogleStrategy();

    this.setupRoutes();
    this.server.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (error: unknown, _req: unknown, res: Response, _next: NextFunction) => {
        if (error) {
          if (error instanceof ZodError) {
            res.status(400).json({ error: fromError(error).toString() });
            return;
          }
          if (error instanceof Error) {
            res.status(500).json({ error: error.toString() });
            return;
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

  setupGoogleStrategy(): void {
    passport.use(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: 'http://localhost:3000/callback',
          scope: ['profile', 'email', 'openid'],
        },
        (issuer, profile, cb) => cb(null, profile),
      ),
    );

    passport.serializeUser((user, cb) => {
      process.nextTick(() => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cb(null, { id: user.id, username: user.username, name: user.name });
      });
    });

    passport.deserializeUser((user, cb) => {
      process.nextTick(() => cb(null, user as any));
    });
  }

  setupRoutes(): void {
    this.server.get('/login/federated/google', passport.authenticate('google'));
    this.server.get(
      '/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
      }),
    );
    this.server.get('/logout', (req, res, next) => {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
    this.server.get('/user-presence', async (req, res) => {
      const { username, date } = getUserPresenceQuerySchema.parse(req.query);
      const workSituation = await this.getUserWorkSituation(
        username,
        new Date(date),
      );
      res.json({
        workSituation,
      });
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
        if (error instanceof UserNotFoundError) {
          res.status(400).json({ error: error.message });
          return;
        }
        throw error;
      }
    });
    this.server.post('/users', async (req, res) => {
      const body = postUserBodySchema.parse(req.body);

      const user = await this.saveUser(
        body.username,
        body.firstName,
        body.lastName,
      );
      res.json({ user: user.toObject() });
    });
    this.server.get('/users', async (req, res) => {
      const result = await this.getAllUsers();
      res.json(result);
    });
    this.server.get('/users/:id', async (req, res) => {
      const query = getUserByIdQuerySchema.parse(req.params);

      const user = await this.remoteWorkApp.getUser(query.id);

      if (user) {
        res.status(200).json({ user: user.toObject() });
        return;
      }
      res.sendStatus(404);
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
