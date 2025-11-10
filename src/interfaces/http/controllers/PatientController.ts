import { Request, Response, NextFunction } from 'express';
import { 
  CreatePatientUseCase, 
  GetPatientUseCase, 
  ListPatientsUseCase, 
  SearchPatientsUseCase,
  UpdatePatientUseCase,
  DeletePatientUseCase
} from '@/application/use-cases';
import { Patient } from '@/domain/entities';
import { HTTP_STATUS } from '@/shared/constants';

export class PatientController {
  constructor(
    private createPatientUseCase: CreatePatientUseCase,
    private getPatientUseCase: GetPatientUseCase,
    private listPatientsUseCase: ListPatientsUseCase,
    private searchPatientsUseCase: SearchPatientsUseCase,
    private updatePatientUseCase: UpdatePatientUseCase,
    private deletePatientUseCase: DeletePatientUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const patient = await this.createPatientUseCase.execute(req.body, userId);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: patient.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const patient = await this.getPatientUseCase.execute(id, userId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: patient.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listPatientsUseCase.execute(userId, page, limit);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.patients.map((p: Patient) => p.toJSON()),
        pagination: { page: result.page, limit: limit, total: result.total, totalPages: result.totalPages }
      });
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.searchPatientsUseCase.execute(query as string, userId, page, limit);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.patients.map(p => p.toJSON()),
        pagination: {
          page: result.page,
          limit: limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const patient = await this.updatePatientUseCase.execute(id, req.body, userId);
      res.status(HTTP_STATUS.OK).json({ success: true, data: patient.toJSON() });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await this.deletePatientUseCase.execute(id, userId);
      res.status(HTTP_STATUS.OK).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}