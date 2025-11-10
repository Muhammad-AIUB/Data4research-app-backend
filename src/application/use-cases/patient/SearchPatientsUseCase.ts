import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { ValidationError } from '@/shared/errors';
import { logger } from '@/shared/utils';
import { PAGINATION } from '@/shared/constants';

export class SearchPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(query: string, userId: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    logger.info('Searching patients', { query, userId, page, limit });

    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters');
    }

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

    const result = await this.patientRepository.search(query.trim(), userId, validPage, validLimit);

    logger.info('Search completed', { 
      resultCount: result.patients.length, 
      total: result.total,
      query, 
      userId 
    });

    return result;
  }
}