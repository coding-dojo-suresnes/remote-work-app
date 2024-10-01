import { v7 as uuidv7 } from 'uuid';

export class UserId {
  private readonly _value: string;

  constructor(_value?: string) {
    if (_value) {
      this._value = _value;
    } else {
      this._value = uuidv7();
    }
  }

  public get value(): string {
    return this._value;
  }
}
