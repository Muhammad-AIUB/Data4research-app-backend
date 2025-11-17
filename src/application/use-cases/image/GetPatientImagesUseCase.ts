import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { logger } from '@/shared/utils';

export class GetPatientImagesUseCase {
  constructor(private imageRepository: IImageRepository) {}

  async execute(patientId: string) {
    logger.info('Getting patient images', { patientId });
    return await this.imageRepository.findPatientImages(patientId);
  }
}