import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { logger } from '@/shared/utils';
import { PAGINATION } from '@/shared/constants';

export class ListPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(userId: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    logger.info('Listing patients', { userId, page, limit });

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

    const result = await this.patientRepository.findAll(userId, validPage, validLimit);

    logger.info('Patients retrieved', { 
      userId, 
      count: result.patients.length, 
      total: result.total 
    });

    return result;
  }
}