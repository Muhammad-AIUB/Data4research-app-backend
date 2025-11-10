import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class DeleteInvestigationUseCase {
  constructor(private investigationRepository: IInvestigationRepository) {}

  async execute(sessionId: string): Promise<void> {
    logger.info('Deleting investigation', { sessionId });

    const session = await this.investigationRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError(`Investigation session with ID ${sessionId} not found`);
    }

    await this.investigationRepository.deleteSession(sessionId);

    logger.info('Investigation deleted successfully', { sessionId });
  }
}