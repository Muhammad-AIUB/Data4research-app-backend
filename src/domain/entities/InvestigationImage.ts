import { ValidationError } from '@/shared/errors';

export class InvestigationImage {
  public readonly id: string;
  public readonly investigationId: string;
  public imagePath: string;
  public imageType: string;
  public description?: string;
  public readonly createdAt: Date;

  constructor(
    id: string,
    investigationId: string,
    imagePath: string,
    imageType: string,
    description?: string,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.investigationId = investigationId;
    this.imagePath = imagePath;
    this.imageType = imageType;
    this.description = description;
    this.createdAt = createdAt;
    this.validate();
  }

  private validate(): void {
    if (!this.investigationId) {
      throw new ValidationError('Investigation ID is required');
    }
    if (!this.imagePath) {
      throw new ValidationError('Image path is required');
    }
  }

  public toJSON() {
    return {
      id: this.id,
      investigationId: this.investigationId,
      imagePath: this.imagePath,
      imageType: this.imageType,
      description: this.description,
      createdAt: this.createdAt
    };
  }

  public static create(data: {
    id: string;
    investigationId: string;
    imagePath: string;
    imageType: string;
    description?: string;
  }): InvestigationImage {
    return new InvestigationImage(
      data.id,
      data.investigationId,
      data.imagePath,
      data.imageType,
      data.description
    );
  }
}