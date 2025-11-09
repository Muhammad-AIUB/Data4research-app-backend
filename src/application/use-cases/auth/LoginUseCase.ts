import { User } from '@/domain/entities';
import { IUserRepository } from '@/domain/interfaces/repositories/IUserRepository';
import { LoginDTO } from '@/application/dto/LoginDTO';
import { UnauthorizedError } from '@/shared/errors';
import { PasswordService } from '@/infrastructure/auth/PasswordService';
import { JWTService } from '@/infrastructure/auth/JWTService';
import { logger } from '@/shared/utils';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: PasswordService,
    private jwtService: JWTService
  ) {}

  async execute(dto: LoginDTO): Promise<{ user: User; token: string }> {
    logger.info('User login attempt', { username: dto.username });

    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    const token = this.jwtService.generateToken(user.id, user.username);

    logger.info('User logged in successfully', { userId: user.id, username: user.username });

    return { user, token };
  }
}