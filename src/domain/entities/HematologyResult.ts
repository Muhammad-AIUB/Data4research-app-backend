import { ValidationError } from '@/shared/errors';

export class HematologyResult {
  public readonly id: string;
  public readonly sessionId: string;
  public testName: string;
  public value: string;
  public unit?: string;
  public isFavourite: boolean;
  public notes?: string;
  public readonly createdAt: Date;

  constructor(
    id: string,
    sessionId: string,
    testName: string,
    value: string,
    unit?: string,
    isFavourite: boolean = false,
    notes?: string,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.sessionId = sessionId;
    this.testName = testName;
    this.value = value;
    this.unit = unit;
    this.isFavourite = isFavourite;
    this.notes = notes;
    this.createdAt = createdAt;
    this.validate();
  }

  private validate(): void {
    if (!this.testName || this.testName.trim().length === 0) {
      throw new ValidationError('Test name is required');
    }
    if (!this.value || this.value.trim().length === 0) {
      throw new ValidationError('Test value is required');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      sessionId: this.sessionId,
      testName: this.testName,
      value: this.value,
      unit: this.unit,
      isFavourite: this.isFavourite,
      notes: this.notes,
      createdAt: this.createdAt
    };
  }

  public static create(data: {
    id: string;
    sessionId: string;
    testName: string;
    value: string;
    unit?: string;
    isFavourite?: boolean;
    notes?: string;
  }): HematologyResult {
    return new HematologyResult(
      data.id,
      data.sessionId,
      data.testName,
      data.value,
      data.unit,
      data.isFavourite,
      data.notes
    );
  }
}