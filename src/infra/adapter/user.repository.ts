import { IUserPort } from '../../domain/ports/output/user.port';
import { UserId } from '../../domain/user-id.value-object';
import { UserEntity } from '../../domain/user.entity';

export class UserRepository implements IUserPort {
  private _users: Array<UserEntity> = [];

  public getUserByUsername(username: string): UserEntity | null {
    return this._users.find((user) => user.username === username) ?? null;
  }

  public getUserById(id: UserId): UserEntity | null {
    return this._users.find((user) => user.id.value === id.value) ?? null;
  }

  public persistUser(user: UserEntity): void {
    const existingIndex = this._users.findIndex(
      (u: UserEntity) => u.id.value === user.id.value,
    );

    if (existingIndex < 0) {
      this._users.push(user.clone());
    } else {
      this._users[existingIndex] = user.clone();
    }
  }

  public getAll(): Promise<UserEntity[]> {
    return Promise.resolve(this._users);
  }
}
