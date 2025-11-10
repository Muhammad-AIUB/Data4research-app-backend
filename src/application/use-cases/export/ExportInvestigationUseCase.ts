import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { ExcelService } from '@/infrastructure/excel/ExcelService';
import { NotFoundError } from '@/shared/errors';
import { logger } from '@/shared/utils';

export class ExportInvestigationUseCase {
  constructor(
    private investigationRepository: IInvestigationRepository,
    private excelService: ExcelService
  ) {}

  async execute(sessionId: string): Promise<Buffer> {
    logger.info('Exporting investigation', { sessionId });

    const investigation = await this.investigationRepository.getSessionWithResults(sessionId);
    if (!investigation) {
      throw new NotFoundError(`Investigation with ID ${sessionId} not found`);
    }

    const buffer = await this.excelService.exportInvestigationReport(investigation);

    logger.info('Investigation exported', { sessionId });

    return buffer;
  }
}