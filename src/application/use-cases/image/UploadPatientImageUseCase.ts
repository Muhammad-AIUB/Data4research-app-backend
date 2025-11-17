import { PatientImage } from '@/domain/entities/PatientImage';
import { IImageRepository } from '@/interfaces/repositories/IImageRepository';
import { IPatientRepository } from '@/domain/interfaces/repositories/IPatientRepository';
import { FileStorageService } from '@/infrastructure/storage/FileStorageService';
import { NotFoundError } from '@/shared/errors';
import { v4 as uuid } from 'uuid';
import { logger } from '@/shared/utils';

export class UploadPatientImageUseCase {
  constructor(
    private imageRepository: IImageRepository,
    private patientRepository: IPatientRepository,
    private fileStorageService: FileStorageService
  ) {}

  async execute(
    file: Express.Multer.File,
    patientId: string,
    userId: string,
    description?: string
  ): Promise<PatientImage> {
    logger.info('Uploading patient image', { patientId, userId });

    const patient = await this.patientRepository.findById(patientId, userId);
    if (!patient) {
      throw new NotFoundError(`Patient with ID ${patientId} not found`);
    }

    this.fileStorageService.validateImageFile(file);

    const imagePath = await this.fileStorageService.savePatientImage(file, patientId);

    const image = PatientImage.create({
      id: uuid(),
      patientId: patientId,
      imagePath: imagePath,
      imageType: file.mimetype,
      description: description
    });

    const savedImage = await this.imageRepository.savePatientImage(image);

    logger.info('Patient image uploaded', { imageId: savedImage.id, patientId, userId });

    return savedImage;
  }
}