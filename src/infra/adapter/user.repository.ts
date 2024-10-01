import { IUserPort } from '../../domain/ports/output/user.port';
import { UserEntity } from '../../domain/user.entity';

export class UserRepository implements IUserPort {
  private _users: Array<UserEntity> = [];

  public getUserByUsername(username: string): UserEntity | null {
    return this._users.find((user) => user.username === username) ?? null;
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
}
