import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { ValidationError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class SearchPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(query: string, userId: string): Promise<Patient[]> {
    logger.info('Searching patients', { query, userId });

    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters');
    }

    const patients = await this.patientRepository.search(query.trim(), userId);

    logger.info('Search completed', { resultCount: patients.length, query, userId });

    return patients;
  }
}