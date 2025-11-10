import { InvestigationSession } from '@/domain/entities/InvestigationSession';
import { HematologyResult } from '@/domain/entities/HematologyResult';
import { LFTResult } from '@/domain/entities/LFTResult';
import { RFTResult } from '@/domain/entities/RFTResult';

export interface IInvestigationRepository {
  createSession(session: InvestigationSession): Promise<InvestigationSession>;
  findSessionById(id: string): Promise<InvestigationSession | null>;
  findSessionsByPatient(patientId: string, page?: number, limit?: number): Promise<{
    sessions: InvestigationSession[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  deleteSession(id: string): Promise<void>;
  
  addHematologyResult(result: HematologyResult): Promise<HematologyResult>;
  addLFTResult(result: LFTResult): Promise<LFTResult>;
  addRFTResult(result: RFTResult): Promise<RFTResult>;
  
  getSessionWithResults(sessionId: string): Promise<{
    session: InvestigationSession;
    hematology: HematologyResult[];
    lft: LFTResult[];
    rft: RFTResult[];
  } | null>;
  
  updateHematologyResult(id: string, result: HematologyResult): Promise<HematologyResult>;
  updateLFTResult(id: string, result: LFTResult): Promise<LFTResult>;
  updateRFTResult(id: string, result: RFTResult): Promise<RFTResult>;
  
  deleteHematologyResult(id: string): Promise<void>;
  deleteLFTResult(id: string): Promise<void>;
  deleteRFTResult(id: string): Promise<void>;
}