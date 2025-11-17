import { Request, Response, NextFunction } from 'express';
import {
  CreateClinicalEntryUseCase,
  ListClinicalEntriesUseCase,
  UpdateClinicalEntryUseCase,
  DeleteClinicalEntryUseCase
} from '@/application/use-cases';
import { HTTP_STATUS } from '@/shared/constants';
import { ClinicalSectionType } from '@/domain/entities';

export class ClinicalDataController {
  constructor(
    private createClinicalEntryUseCase: CreateClinicalEntryUseCase,
    private listClinicalEntriesUseCase: ListClinicalEntriesUseCase,
    private updateClinicalEntryUseCase: UpdateClinicalEntryUseCase,
    private deleteClinicalEntryUseCase: DeleteClinicalEntryUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const trimmedPatientId = patientId?.trim();
      const userId = (req as any).user.id;
      const entry = await this.createClinicalEntryUseCase.execute(trimmedPatientId, userId, req.body);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: entry.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const trimmedPatientId = patientId?.trim();
      const section = req.query.section as ClinicalSectionType;
      if (!section) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: { message: 'Section query parameter is required' }
        });
      }
      const userId = (req as any).user.id;
      const entries = await this.listClinicalEntriesUseCase.execute(trimmedPatientId, userId, section);
      res.status(HTTP_STATUS.OK).json({ success: true, data: entries.map((e) => e.toJSON()) });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, entryId } = req.params;
      const trimmedPatientId = patientId?.trim();
      const trimmedEntryId = entryId?.trim();
      const section = (req.query.section as ClinicalSectionType) || req.body.section;
      if (!section) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: { message: 'Section is required to update an entry' }
        });
      }
      const userId = (req as any).user.id;
      const entry = await this.updateClinicalEntryUseCase.execute(
        trimmedPatientId,
        userId,
        trimmedEntryId,
        section,
        req.body
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data: entry.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, entryId } = req.params;
      const trimmedPatientId = patientId?.trim();
      const trimmedEntryId = entryId?.trim();
      const section = req.query.section as ClinicalSectionType;
      if (!section) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: { message: 'Section query parameter is required' }
        });
      }
      const userId = (req as any).user.id;
      await this.deleteClinicalEntryUseCase.execute(trimmedPatientId, userId, trimmedEntryId, section);
      res.status(HTTP_STATUS.OK).json({ 
        success: true, 
        message: 'Clinical entry deleted successfully' 
      });
    } catch (error) {
      next(error);
    }
  };
}

