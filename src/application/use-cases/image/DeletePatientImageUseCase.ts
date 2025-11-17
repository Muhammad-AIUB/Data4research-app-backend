import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { FileStorageService } from '@/infrastructure/storage/FileStorageService';
import { logger } from '@/shared/utils';

export class DeletePatientImageUseCase {
  constructor(
    private imageRepository: IImageRepository,
    private fileStorageService: FileStorageService
  ) {}

  async execute(imageId: string) {
    logger.info('Deleting patient image', { imageId });

    const images = await this.imageRepository.findPatientImages(''); // Need to get image first
    const image = images.find(img => img.id === imageId);
    
    if (image) {
      await this.fileStorageService.deleteFile(image.imagePath);
      await this.imageRepository.deletePatientImage(imageId);
    }

    logger.info('Patient image deleted', { imageId });
  }
}