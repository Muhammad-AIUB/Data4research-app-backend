import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { logger } from '@/shared/utils';
import { PAGINATION } from '@/shared/constants';

export class ListInvestigationsUseCase {
  constructor(private investigationRepository: IInvestigationRepository) {}

  async execute(patientId: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    logger.info('Listing investigations', { patientId, page, limit });

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

    const result = await this.investigationRepository.findSessionsByPatient(patientId, validPage, validLimit);

    logger.info('Investigations retrieved', { 
      patientId, 
      count: result.sessions.length, 
      total: result.total 
    });

    return result;
  }
}