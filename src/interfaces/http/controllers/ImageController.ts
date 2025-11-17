import { Request, Response, NextFunction } from 'express';
import {
  UploadPatientImageUseCase,
  UploadInvestigationImageUseCase,
  GetPatientImagesUseCase,
  GetInvestigationImagesUseCase,
  DeletePatientImageUseCase
} from '@/application/use-cases';
import { HTTP_STATUS } from '@/shared/constants';

export class ImageController {
  constructor(
    private uploadPatientImageUseCase: UploadPatientImageUseCase,
    private uploadInvestigationImageUseCase: UploadInvestigationImageUseCase,
    private getPatientImagesUseCase: GetPatientImagesUseCase,
    private getInvestigationImagesUseCase: GetInvestigationImagesUseCase,
    private deletePatientImageUseCase: DeletePatientImageUseCase
  ) {}

  uploadPatientImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: { message: 'No image file provided' }
        });
      }

      const { patientId } = req.params;
      const { description } = req.body;
      const userId = (req as any).user.id;

      const image = await this.uploadPatientImageUseCase.execute(
        req.file,
        patientId,
        userId,
        description
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: image.toJSON()
      });
    } catch (error) {
      next(error);
    }
  };

  uploadInvestigationImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: { message: 'No image file provided' }
        });
      }

      const { investigationId } = req.params;
      const { description } = req.body;

      const image = await this.uploadInvestigationImageUseCase.execute(
        req.file,
        investigationId,
        description
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: image.toJSON()
      });
    } catch (error) {
      next(error);
    }
  };

  getPatientImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const images = await this.getPatientImagesUseCase.execute(patientId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: images.map(img => img.toJSON())
      });
    } catch (error) {
      next(error);
    }
  };

  getInvestigationImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { investigationId } = req.params;
      const images = await this.getInvestigationImagesUseCase.execute(investigationId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: images.map(img => img.toJSON())
      });
    } catch (error) {
      next(error);
    }
  };

  deletePatientImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;
      await this.deletePatientImageUseCase.execute(imageId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}