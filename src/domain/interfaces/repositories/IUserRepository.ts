import { User } from '@/domain/entities';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

