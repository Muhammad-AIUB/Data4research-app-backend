import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class GetInvestigationUseCase {
  constructor(private investigationRepository: IInvestigationRepository) {}

  async execute(sessionId: string) {
    logger.info('Getting investigation', { sessionId });

    const data = await this.investigationRepository.getSessionWithResults(sessionId);

    if (!data) {
      throw new NotFoundError(`Investigation session with ID ${sessionId} not found`);
    }

    return data;
  }
}