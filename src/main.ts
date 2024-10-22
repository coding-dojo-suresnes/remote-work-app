import { RemoteWorkApp } from './domain';
import { RemoteWorkServer } from './infra/adapter/server';
import { UserWorkSituationRepository } from './infra/adapter/user-work-situation.repository';
import { UserRepository } from './infra/adapter/user.repository';

const userRepository = new UserRepository();
const userWorkSituationRepository = new UserWorkSituationRepository();
const server = new RemoteWorkServer(
  new RemoteWorkApp(userWorkSituationRepository, userRepository),
);

server.start();
