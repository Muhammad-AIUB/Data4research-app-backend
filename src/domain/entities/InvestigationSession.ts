import { ValidationError } from '@/shared/errors';

export class InvestigationSession {
  public readonly id: string;
  public readonly patientId: string;
  public investigationDate: Date;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    patientId: string,
    investigationDate: Date,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.patientId = patientId;
    this.investigationDate = investigationDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.validate();
  }

  private validate(): void {
    if (!this.patientId) {
      throw new ValidationError('Patient ID is required');
    }
    if (!(this.investigationDate instanceof Date)) {
      throw new ValidationError('Invalid investigation date');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      investigationDate: this.investigationDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public static create(data: {
    id: string;
    patientId: string;
    investigationDate: Date;
  }): InvestigationSession {
    return new InvestigationSession(data.id, data.patientId, data.investigationDate);
  }
}