import { IPatientRepository, IPatientClinicalRepository } from '@/domain/interfaces';
import { NotFoundError } from '@/shared/errors';
import { ClinicalSectionType } from '@/domain/entities';

export class ListClinicalEntriesUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private clinicalRepository: IPatientClinicalRepository
  ) {}

  async execute(patientId: string, userId: string, section: ClinicalSectionType) {
    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    return this.clinicalRepository.list(patientId, section);
  }
}

