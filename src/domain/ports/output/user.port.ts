import { UserId } from '../../user-id.value-object';
import { UserEntity } from '../../user.entity';

export interface IUserPort {
  getAll(): Promise<UserEntity[]>;

  getUserByUsername(username: string): UserEntity | null;

  getUserById(id: UserId): UserEntity | null;

  persistUser(user: UserEntity): void;
}
