import { UserEntity } from '../../user.entity';

export interface IUserPort {
  getUserByUsername(username: string): UserEntity | null;

  persistUser(user: UserEntity): void;
}
