import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { ExcelService } from '@/infrastructure/excel/ExcelService';
import { logger } from '@/shared/utils';

export class ExportPatientsUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private excelService: ExcelService
  ) {}

  async execute(userId: string): Promise<Buffer> {
    logger.info('Exporting patients', { userId });

    const result = await this.patientRepository.findAll(userId, 1, 10000);

    const buffer = await this.excelService.exportPatients(result.patients);

    logger.info('Patients exported', { count: result.patients.length, userId });

    return buffer;
  }
}