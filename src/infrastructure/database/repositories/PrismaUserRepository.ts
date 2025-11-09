import { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import { User } from '@/domain/entities';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PrismaUserRepository implements IUserRepository {
  
  async save(user: User): Promise<User> {
    const saved = await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async update(id: string, user: User): Promise<User> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        username: user.username,
        email: user.email,
        updatedAt: new Date()
      }
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  private toDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.username,
      prismaUser.passwordHash,
      prismaUser.email,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }
}

