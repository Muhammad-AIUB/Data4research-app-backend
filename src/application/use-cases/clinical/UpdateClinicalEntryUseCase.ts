import { ClinicalEntryDTO } from '@/application/dto';
import { IPatientRepository, IPatientClinicalRepository } from '@/domain/interfaces';
import { NotFoundError } from '@/shared/errors';
import { ClinicalSectionType } from '@/domain/entities';
import { ClinicalDataProcessor } from '@/application/services/ClinicalDataProcessor';
import { logger } from '@/shared/utils';

export class UpdateClinicalEntryUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private clinicalRepository: IPatientClinicalRepository
  ) {}

  async execute(
    patientId: string,
    userId: string,
    entryId: string,
    section: ClinicalSectionType,
    dto: Partial<ClinicalEntryDTO>
  ) {
    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    const existing = await this.clinicalRepository.findById(entryId, section);
    if (!existing || existing.patientId !== patientId) {
      throw new NotFoundError(`Clinical entry not found`);
    }

    // Apply automatic calculations if values are being updated
    let processedValues = dto.values;
    if (dto.values) {
      // Merge with existing values for proper calculation
      const mergedValues = { ...existing.values, ...dto.values };
      processedValues = ClinicalDataProcessor.process(section, mergedValues);
      
      logger.info('Clinical data updated with calculations', { 
        entryId, 
        section,
        patientId
      });
    }

    const updated = await this.clinicalRepository.update(entryId, section, {
      recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : undefined,
      values: processedValues,
      meta: dto.meta
    });

    return updated;
  }
}

