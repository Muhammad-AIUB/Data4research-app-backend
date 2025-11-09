import { User } from '@/domain/entities';
import { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import { RegisterDTO } from '@/application/dto/RegisterDTO';
import { ValidationError } from '@/shared/errors';
import { PasswordService } from '@/infrastructure/auth/PasswordService';
import { JWTService } from '@/infrastructure/auth/JWTService';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: PasswordService,
    private jwtService: JWTService
  ) {}

  async execute(dto: RegisterDTO): Promise<{ user: User; token: string }> {
    logger.info('Registering new user', { username: dto.username });

    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new ValidationError(`Username ${dto.username} already exists`);
    }

    if (dto.email) {
      const existingEmail = await this.userRepository.findByEmail(dto.email);
      if (existingEmail) {
        throw new ValidationError(`Email ${dto.email} already exists`);
      }
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = User.create({
      id: uuid(),
      username: dto.username,
      email: dto.email,
      passwordHash: passwordHash
    });

    const savedUser = await this.userRepository.save(user);

    const token = this.jwtService.generateToken(savedUser.id, savedUser.username);

    logger.info('User registered successfully', { userId: savedUser.id, username: savedUser.username });

    return { user: savedUser, token };
  }
}