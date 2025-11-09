import { Patient } from '@/domain/entities';

export interface IPatientRepository {
  save(patient: Patient, userId: string): Promise<Patient>;
  findById(id: string, userId: string): Promise<Patient | null>;
  findByPatientId(patientId: string, userId: string): Promise<Patient | null>;
  findByMobile(mobile: string, userId: string): Promise<Patient | null>;
  findAll(userId: string, page: number, limit: number): Promise<{
    patients: Patient[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  search(query: string, userId: string): Promise<Patient[]>;
  update(id: string, patient: Patient, userId: string): Promise<Patient>;
  delete(id: string, userId: string): Promise<void>;
  count(userId: string): Promise<number>;
}
