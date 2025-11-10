import { InvestigationSession } from '@/domain/entities/InvestigationSession';
import { HematologyResult } from '@/domain/entities/HematologyResult';
import { LFTResult } from '@/domain/entities/LFTResult';
import { RFTResult } from '@/domain/entities/RFTResult';
import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { CreateInvestigationDTO } from '@/application/dto/CreateInvestigationDTO';
import { NotFoundError, ValidationError } from '@/shared/errors';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

export class CreateInvestigationUseCase {
  constructor(
    private investigationRepository: IInvestigationRepository,
    private patientRepository: IPatientRepository
  ) {}

  async execute(dto: CreateInvestigationDTO, userId: string) {
    logger.info('Creating investigation', { patientId: dto.patientId, userId });

    const patient = await this.patientRepository.findById(dto.patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${dto.patientId} not found`);
    }

    const investigationDate = new Date(dto.investigationDate);
    if (isNaN(investigationDate.getTime())) {
      throw new ValidationError('Invalid investigation date');
    }

    const session = InvestigationSession.create({
      id: uuid(),
      patientId: dto.patientId,
      investigationDate: investigationDate
    });

    const savedSession = await this.investigationRepository.createSession(session);

    const hematologyResults = [];
    if (dto.hematology && dto.hematology.length > 0) {
      for (const test of dto.hematology) {
        const result = HematologyResult.create({
          id: uuid(),
          sessionId: savedSession.id,
          testName: test.testName,
          value: test.value,
          unit: test.unit,
          isFavourite: test.isFavourite,
          notes: test.notes
        });
        const saved = await this.investigationRepository.addHematologyResult(result);
        hematologyResults.push(saved);
      }
    }

    const lftResults = [];
    if (dto.lft && dto.lft.length > 0) {
      for (const test of dto.lft) {
        const result = LFTResult.create({
          id: uuid(),
          sessionId: savedSession.id,
          testName: test.testName,
          value: test.value,
          unit: test.unit,
          testMethod: test.testMethod,
          isFavourite: test.isFavourite,
          notes: test.notes
        });
        const saved = await this.investigationRepository.addLFTResult(result);
        lftResults.push(saved);
      }
    }

    const rftResults = [];
    if (dto.rft && dto.rft.length > 0) {
      for (const test of dto.rft) {
        const result = RFTResult.create({
          id: uuid(),
          sessionId: savedSession.id,
          testName: test.testName,
          value: test.value,
          unit: test.unit,
          isFavourite: test.isFavourite,
          notes: test.notes
        });
        const saved = await this.investigationRepository.addRFTResult(result);
        rftResults.push(saved);
      }
    }

    logger.info('Investigation created successfully', { sessionId: savedSession.id, userId });

    return {
      session: savedSession,
      hematology: hematologyResults,
      lft: lftResults,
      rft: rftResults
    };
  }
}