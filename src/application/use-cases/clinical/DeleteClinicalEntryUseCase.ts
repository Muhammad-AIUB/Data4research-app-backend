import { IPatientRepository, IPatientClinicalRepository } from '@/domain/interfaces';
import { NotFoundError } from '@/shared/errors';
import { ClinicalSectionType } from '@/domain/entities';
import { logger } from '@/shared/utils';

export class DeleteClinicalEntryUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private clinicalRepository: IPatientClinicalRepository
  ) {}

  async execute(patientId: string, userId: string, entryId: string, section: ClinicalSectionType) {
    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    const existing = await this.clinicalRepository.findById(entryId, section);
    if (!existing) {
      throw new NotFoundError(`Clinical entry with ID ${entryId} not found in section ${section}`);
    }
    
    if (existing.patientId !== patientId) {
      throw new NotFoundError(`Clinical entry belongs to a different patient`);
    }

    await this.clinicalRepository.delete(entryId, section);
  }
}

