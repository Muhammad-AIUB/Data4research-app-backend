import { ValidationError } from '@/shared/errors';
import { REGEX } from '@/shared/constants';

export class User {
  public readonly id: string;
  public username: string;
  public email?: string;
  public readonly passwordHash: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    username: string,
    passwordHash: string,
    email?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.validate();
  }

  private validate(): void {
    if (!this.username || this.username.trim().length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }
    if (this.email && !REGEX.EMAIL.test(this.email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public static create(data: {
    id: string;
    username: string;
    passwordHash: string;
    email?: string;
  }): User {
    return new User(data.id, data.username, data.passwordHash, data.email);
  }
}