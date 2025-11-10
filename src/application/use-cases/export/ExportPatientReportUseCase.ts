import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { ExcelService } from '@/infrastructure/excel/ExcelService';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class ExportPatientReportUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private investigationRepository: IInvestigationRepository,
    private excelService: ExcelService
  ) {}

  async execute(patientId: string, userId: string): Promise<Buffer> {
    logger.info('Exporting patient report', { patientId, userId });

    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    const investigationResult = await this.investigationRepository.findSessionsByPatient(patientId, 1, 100);
    
    const investigations = [];
    for (const session of investigationResult.sessions) {
      const data = await this.investigationRepository.getSessionWithResults(session.id);
      if (data) {
        investigations.push(data);
      }
    }

    const buffer = await this.excelService.exportPatientWithInvestigations(patient, investigations);

    logger.info('Patient report exported', { patientId, userId });

    return buffer;
  }
}