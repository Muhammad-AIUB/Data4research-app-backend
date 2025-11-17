import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { logger } from '@/shared/utils';

export class GetInvestigationImagesUseCase {
  constructor(private imageRepository: IImageRepository) {}

  async execute(investigationId: string) {
    logger.info('Getting investigation images', { investigationId });
    return await this.imageRepository.findInvestigationImages(investigationId);
  }
}