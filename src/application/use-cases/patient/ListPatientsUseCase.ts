import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { logger } from '@/shared/utils';
import { PAGINATION } from '@/shared/constants';
import { getCacheService } from '@/infrastructure/cache';
import { redisConfig } from '@/config/redis.config';

export class ListPatientsUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(userId: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    logger.info('Listing patients', { userId, page, limit });

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

    const cache = getCacheService();
    const cacheKey = `patients:list:${userId}:page:${validPage}:limit:${validLimit}`;

    // Try cache first
    const cachedResult = await cache.get<{
      patients: Patient[];
      total: number;
      page: number;
      totalPages: number;
    }>(cacheKey);

    if (cachedResult) {
      logger.info('Patients retrieved from cache', { 
        userId, 
        count: cachedResult.patients.length, 
        total: cachedResult.total 
      });
      return cachedResult;
    }

    // Fetch from database
    const result = await this.patientRepository.findAll(userId, validPage, validLimit);

    // Cache the result (5 minutes TTL for patient lists)
    await cache.set(cacheKey, result, redisConfig.patientListTtl);

    logger.info('Patients retrieved from database', { 
      userId, 
      count: result.patients.length, 
      total: result.total 
    });

    return result;
  }
}