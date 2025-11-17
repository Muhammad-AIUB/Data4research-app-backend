import { PatientImage } from '@/domain/entities/PatientImage';
import { InvestigationImage } from '@/domain/entities/InvestigationImage';

export interface IImageRepository {
  savePatientImage(image: PatientImage): Promise<PatientImage>;
  findPatientImages(patientId: string): Promise<PatientImage[]>;
  deletePatientImage(id: string): Promise<void>;
  
  saveInvestigationImage(image: InvestigationImage): Promise<InvestigationImage>;
  findInvestigationImages(investigationId: string): Promise<InvestigationImage[]>;
  deleteInvestigationImage(id: string): Promise<void>;
}