import { PatientClinicalEntry, ClinicalSectionType } from '@/domain/entities';

export interface CreateClinicalEntryDTO {
  patientId: string;
  section: ClinicalSectionType;
  recordedAt: Date;
  values: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export interface UpdateClinicalEntryDTO {
  recordedAt?: Date;
  values?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export interface IPatientClinicalRepository {
  create(entry: CreateClinicalEntryDTO): Promise<PatientClinicalEntry>;
  update(entryId: string, section: ClinicalSectionType, data: UpdateClinicalEntryDTO): Promise<PatientClinicalEntry>;
  delete(entryId: string, section: ClinicalSectionType): Promise<void>;
  findById(entryId: string, section: ClinicalSectionType): Promise<PatientClinicalEntry | null>;
  list(patientId: string, section: ClinicalSectionType): Promise<PatientClinicalEntry[]>;
}

