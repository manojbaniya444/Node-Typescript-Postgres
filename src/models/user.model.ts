export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
}

export class User implements IUser {
  id: number;
  email: string;
  password: string;
  name: string;

  constructor(data: Partial<IUser>) {
    this.id = data.id || 0;
    this.email = data.email || '';
    this.password = data.password || '';
    this.name = data.name || '';
  }

  toJSON(): Partial<IUser> {
    const { password, ...others } = this;
    return others;
  }

  validatePassword(): boolean {
    return this.password.length >= 8;
  }
}
