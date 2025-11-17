import { ClinicalSectionType } from '@/domain/entities';

export interface ClinicalEntryDTO {
  section: ClinicalSectionType;
  recordedAt: string; // ISO date string
  values: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

