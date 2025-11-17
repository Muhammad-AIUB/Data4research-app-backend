import { ValidationError } from '@/shared/errors';

export class PatientImage {
  public readonly id: string;
  public readonly patientId: string;
  public imagePath: string;
  public imageType: string;
  public description?: string;
  public readonly createdAt: Date;

  constructor(
    id: string,
    patientId: string,
    imagePath: string,
    imageType: string,
    description?: string,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.patientId = patientId;
    this.imagePath = imagePath;
    this.imageType = imageType;
    this.description = description;
    this.createdAt = createdAt;
    this.validate();
  }

  private validate(): void {
    if (!this.patientId) {
      throw new ValidationError('Patient ID is required');
    }
    if (!this.imagePath) {
      throw new ValidationError('Image path is required');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      imagePath: this.imagePath,
      imageType: this.imageType,
      description: this.description,
      createdAt: this.createdAt
    };
  }

  public static create(data: {
    id: string;
    patientId: string;
    imagePath: string;
    imageType: string;
    description?: string;
  }): PatientImage {
    return new PatientImage(
      data.id,
      data.patientId,
      data.imagePath,
      data.imageType,
      data.description
    );
  }
}