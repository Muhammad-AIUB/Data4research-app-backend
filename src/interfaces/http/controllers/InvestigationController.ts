import { Request, Response, NextFunction } from 'express';
import { 
  CreateInvestigationUseCase,
  GetInvestigationUseCase,
  ListInvestigationsUseCase,
  DeleteInvestigationUseCase
} from '@/application/use-cases';
import { HTTP_STATUS } from '@/shared/constants';

export class InvestigationController {
  constructor(
    private createInvestigationUseCase: CreateInvestigationUseCase,
    private getInvestigationUseCase: GetInvestigationUseCase,
    private listInvestigationsUseCase: ListInvestigationsUseCase,
    private deleteInvestigationUseCase: DeleteInvestigationUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.createInvestigationUseCase.execute(req.body, userId);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          session: result.session.toJSON(),
          hematology: result.hematology.map(h => h.toJSON()),
          lft: result.lft.map(l => l.toJSON()),
          rft: result.rft.map(r => r.toJSON())
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.getInvestigationUseCase.execute(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          session: result.session.toJSON(),
          hematology: result.hematology.map(h => h.toJSON()),
          lft: result.lft.map(l => l.toJSON()),
          rft: result.rft.map(r => r.toJSON())
        }
      });
    } catch (error) {
      next(error);
    }
  };

  listByPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.listInvestigationsUseCase.execute(patientId, page, limit);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.sessions.map(s => s.toJSON()),
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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.deleteInvestigationUseCase.execute(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Investigation deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}