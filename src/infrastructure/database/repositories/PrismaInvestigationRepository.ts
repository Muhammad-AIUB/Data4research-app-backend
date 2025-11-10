import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { InvestigationSession } from '@/domain/entities/InvestigationSession';
import { HematologyResult } from '@/domain/entities/HematologyResult';
import { LFTResult } from '@/domain/entities/LFTResult';
import { RFTResult } from '@/domain/entities/RFTResult';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PrismaInvestigationRepository implements IInvestigationRepository {
  
  async createSession(session: InvestigationSession): Promise<InvestigationSession> {
    const saved = await prisma.investigationSession.create({
      data: {
        id: session.id,
        patientId: session.patientId,
        investigationDate: session.investigationDate,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    });
    return this.sessionToDomain(saved);
  }

  async findSessionById(id: string): Promise<InvestigationSession | null> {
    const session = await prisma.investigationSession.findUnique({ where: { id } });
    if (!session) return null;
    return this.sessionToDomain(session);
  }

  async findSessionsByPatient(patientId: string, page: number = 1, limit: number = 10): Promise<{
    sessions: InvestigationSession[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      prisma.investigationSession.findMany({
        where: { patientId },
        skip,
        take: limit,
        orderBy: { investigationDate: 'desc' }
      }),
      prisma.investigationSession.count({ where: { patientId } })
    ]);
    return {
      sessions: sessions.map(s => this.sessionToDomain(s)),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async deleteSession(id: string): Promise<void> {
    await prisma.investigationSession.delete({ where: { id } });
  }

  async addHematologyResult(result: HematologyResult): Promise<HematologyResult> {
    const saved = await prisma.hematologyResult.create({
      data: {
        id: result.id,
        sessionId: result.sessionId,
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        isFavourite: result.isFavourite,
        notes: result.notes,
        createdAt: result.createdAt
      }
    });
    return this.hematologyToDomain(saved);
  }

  async addLFTResult(result: LFTResult): Promise<LFTResult> {
    const saved = await prisma.lFTResult.create({
      data: {
        id: result.id,
        sessionId: result.sessionId,
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        testMethod: result.testMethod,
        isFavourite: result.isFavourite,
        notes: result.notes,
        createdAt: result.createdAt
      }
    });
    return this.lftToDomain(saved);
  }

  async addRFTResult(result: RFTResult): Promise<RFTResult> {
    const saved = await prisma.rFTResult.create({
      data: {
        id: result.id,
        sessionId: result.sessionId,
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        isFavourite: result.isFavourite,
        notes: result.notes,
        createdAt: result.createdAt
      }
    });
    return this.rftToDomain(saved);
  }

  async getSessionWithResults(sessionId: string): Promise<{
    session: InvestigationSession;
    hematology: HematologyResult[];
    lft: LFTResult[];
    rft: RFTResult[];
  } | null> {
    const data = await prisma.investigationSession.findUnique({
      where: { id: sessionId },
      include: {
        hematologyResults: true,
        lftResults: true,
        rftResults: true
      }
    });
    if (!data) return null;
    return {
      session: this.sessionToDomain(data),
      hematology: data.hematologyResults.map(h => this.hematologyToDomain(h)),
      lft: data.lftResults.map(l => this.lftToDomain(l)),
      rft: data.rftResults.map(r => this.rftToDomain(r))
    };
  }

  async updateHematologyResult(id: string, result: HematologyResult): Promise<HematologyResult> {
    const updated = await prisma.hematologyResult.update({
      where: { id },
      data: {
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        isFavourite: result.isFavourite,
        notes: result.notes
      }
    });
    return this.hematologyToDomain(updated);
  }

  async updateLFTResult(id: string, result: LFTResult): Promise<LFTResult> {
    const updated = await prisma.lFTResult.update({
      where: { id },
      data: {
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        testMethod: result.testMethod,
        isFavourite: result.isFavourite,
        notes: result.notes
      }
    });
    return this.lftToDomain(updated);
  }

  async updateRFTResult(id: string, result: RFTResult): Promise<RFTResult> {
    const updated = await prisma.rFTResult.update({
      where: { id },
      data: {
        testName: result.testName,
        value: result.value,
        unit: result.unit,
        isFavourite: result.isFavourite,
        notes: result.notes
      }
    });
    return this.rftToDomain(updated);
  }

  async deleteHematologyResult(id: string): Promise<void> {
    await prisma.hematologyResult.delete({ where: { id } });
  }

  async deleteLFTResult(id: string): Promise<void> {
    await prisma.lFTResult.delete({ where: { id } });
  }

  async deleteRFTResult(id: string): Promise<void> {
    await prisma.rFTResult.delete({ where: { id } });
  }

  private sessionToDomain(data: any): InvestigationSession {
    return new InvestigationSession(data.id, data.patientId, data.investigationDate, data.createdAt, data.updatedAt);
  }

  private hematologyToDomain(data: any): HematologyResult {
    return new HematologyResult(data.id, data.sessionId, data.testName, data.value, data.unit, data.isFavourite, data.notes, data.createdAt);
  }

  private lftToDomain(data: any): LFTResult {
    return new LFTResult(data.id, data.sessionId, data.testName, data.value, data.unit, data.testMethod, data.isFavourite, data.notes, data.createdAt);
  }

  private rftToDomain(data: any): RFTResult {
    return new RFTResult(data.id, data.sessionId, data.testName, data.value, data.unit, data.isFavourite, data.notes, data.createdAt);
  }
}