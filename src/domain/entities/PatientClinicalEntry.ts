import { ValidationError } from '@/shared/errors';

export type ClinicalSectionType = 'ON_EXAMINATION' | 'HEMATOLOGY' | 'LFT' | 'RFT';

export interface PatientClinicalEntryProps {
  id: string;
  patientId: string;
  section: ClinicalSectionType;
  recordedAt: Date;
  values: Record<string, unknown>;
  meta?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PatientClinicalEntry {
  public readonly id: string;
  public readonly patientId: string;
  public readonly section: ClinicalSectionType;
  public recordedAt: Date;
  public values: Record<string, unknown>;
  public meta?: Record<string, unknown>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: PatientClinicalEntryProps) {
    this.id = props.id;
    this.patientId = props.patientId;
    this.section = props.section;
    this.recordedAt = props.recordedAt;
    this.values = props.values;
    this.meta = props.meta;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  private validate() {
    if (!this.patientId) {
      throw new ValidationError('Patient ID is required for clinical entry');
    }
    if (!this.section) {
      throw new ValidationError('Section is required for clinical entry');
    }
    if (!(this.recordedAt instanceof Date) || isNaN(this.recordedAt.getTime())) {
      throw new ValidationError('Recorded date is invalid');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      section: this.section,
      recordedAt: this.recordedAt,
      values: this.values,
      meta: this.meta,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public static create(props: PatientClinicalEntryProps) {
    return new PatientClinicalEntry(props);
  }
}

