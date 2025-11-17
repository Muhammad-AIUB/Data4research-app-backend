import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';
import { getCacheService } from '@/infrastructure/cache';

export class DeletePatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    logger.info('Deleting patient', { patientId: id, userId });

    const existingPatient = await this.patientRepository.findById(id, userId);
    if (!existingPatient) {
      throw new NotFoundError(`Patient with ID ${id} not found`);
    }

    await this.patientRepository.delete(id, userId);

    // Invalidate patient list cache and individual patient cache
    const cache = getCacheService();
    await cache.deletePattern(`patients:list:${userId}:*`);
    await cache.delete(`patient:${id}:${userId}`);

    logger.info('Patient deleted successfully', { patientId: id, userId });
  }
}