import { Patient } from '@/domain/entities/Patient';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class GetPatientUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(patientId: string, userId: string): Promise<Patient> {
    logger.info('Getting patient', { patientId, userId });

    const patient = await this.patientRepository.findById(patientId, userId);

    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    return patient;
  }
}