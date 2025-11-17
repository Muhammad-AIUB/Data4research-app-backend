import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { PatientImage } from '@/domain/entities/PatientImage';
import { InvestigationImage } from '@/domain/entities/InvestigationImage';
import { prisma } from '@/infrastructure/database/prisma/client';

export class PrismaImageRepository implements IImageRepository {
  
  async savePatientImage(image: PatientImage): Promise<PatientImage> {
    const saved = await prisma.patientImage.create({
      data: {
        id: image.id,
        patientId: image.patientId,
        imagePath: image.imagePath,
        imageType: image.imageType,
        description: image.description,
        createdAt: image.createdAt
      }
    });
    return this.patientImageToDomain(saved);
  }

  async findPatientImages(patientId: string): Promise<PatientImage[]> {
    const images = await prisma.patientImage.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' }
    });
    return images.map(img => this.patientImageToDomain(img));
  }

  async deletePatientImage(id: string): Promise<void> {
    await prisma.patientImage.delete({ where: { id } });
  }

  async saveInvestigationImage(image: InvestigationImage): Promise<InvestigationImage> {
    const saved = await prisma.investigationImage.create({
      data: {
        id: image.id,
        investigationId: image.investigationId,
        imagePath: image.imagePath,
        imageType: image.imageType,
        description: image.description,
        createdAt: image.createdAt
      }
    });
    return this.investigationImageToDomain(saved);
  }

  async findInvestigationImages(investigationId: string): Promise<InvestigationImage[]> {
    const images = await prisma.investigationImage.findMany({
      where: { investigationId },
      orderBy: { createdAt: 'desc' }
    });
    return images.map(img => this.investigationImageToDomain(img));
  }

  async deleteInvestigationImage(id: string): Promise<void> {
    await prisma.investigationImage.delete({ where: { id } });
  }

  private patientImageToDomain(data: any): PatientImage {
    return new PatientImage(
      data.id,
      data.patientId,
      data.imagePath,
      data.imageType,
      data.description,
      data.createdAt
    );
  }

  private investigationImageToDomain(data: any): InvestigationImage {
    return new InvestigationImage(
      data.id,
      data.investigationId,
      data.imagePath,
      data.imageType,
      data.description,
      data.createdAt
    );
  }
}