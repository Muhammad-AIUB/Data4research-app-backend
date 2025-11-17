import { InvestigationImage } from '@/domain/entities/InvestigationImage';
import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { IInvestigationRepository } from '@/interfaces/repositories/IInvestigationRepository';
import { FileStorageService } from '@/infrastructure/storage/FileStorageService';
import { NotFoundError } from '@/shared/errors';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

export class UploadInvestigationImageUseCase {
  constructor(
    private imageRepository: IImageRepository,
    private investigationRepository: IInvestigationRepository,
    private fileStorageService: FileStorageService
  ) {}

  async execute(
    file: Express.Multer.File,
    investigationId: string,
    description?: string
  ): Promise<InvestigationImage> {
    logger.info('Uploading investigation image', { investigationId });

    const investigation = await this.investigationRepository.findSessionById(investigationId);
    if (!investigation) {
      throw new NotFoundError(`Investigation with ID ${investigationId} not found`);
    }

    this.fileStorageService.validateImageFile(file);

    const imagePath = await this.fileStorageService.saveInvestigationImage(file, investigationId);

    const image = InvestigationImage.create({
      id: uuid(),
      investigationId: investigationId,
      imagePath: imagePath,
      imageType: file.mimetype,
      description: description
    });

    const savedImage = await this.imageRepository.saveInvestigationImage(image);

    logger.info('Investigation image uploaded', { imageId: savedImage.id, investigationId });

    return savedImage;
  }
}