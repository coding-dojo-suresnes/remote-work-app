import { UserId } from './user-id.value-object';

export class UserEntity {
  private readonly _id: UserId;

  public firstName: string | undefined;

  public lastName: string | undefined;

  constructor(
    private readonly _username: string,
    id?: UserId,
  ) {
    this._id = id ?? new UserId();
  }

  public get id(): UserId {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public clone(): UserEntity {
    const clone = new UserEntity(this._username, this._id);
    clone.firstName = this.firstName;
    clone.lastName = this.lastName;

    return clone;
  }

  public toObject(): {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  } {
    return {
      id: this._id.value,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
