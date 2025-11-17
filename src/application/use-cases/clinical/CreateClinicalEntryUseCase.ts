import { ClinicalEntryDTO } from '@/application/dto';
import { IPatientRepository, IPatientClinicalRepository } from '@/domain/interfaces';
import { NotFoundError } from '@/shared/errors';
import { ClinicalDataProcessor } from '@/application/services/ClinicalDataProcessor';
import { logger } from '@/shared/utils';

export class CreateClinicalEntryUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private clinicalRepository: IPatientClinicalRepository
  ) {}

  async execute(patientId: string, userId: string, dto: ClinicalEntryDTO) {
    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    // Apply automatic calculations and conversions
    const processedValues = ClinicalDataProcessor.process(dto.section, dto.values);
    
    logger.info('Clinical data processed', { 
      section: dto.section, 
      patientId,
      originalValues: Object.keys(dto.values).length,
      processedValues: Object.keys(processedValues).length
    });

    const entry = await this.clinicalRepository.create({
      patientId,
      section: dto.section,
      recordedAt: new Date(dto.recordedAt),
      values: processedValues,
      meta: dto.meta
    });

    return entry;
  }
}

