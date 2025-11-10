import { Request, Response, NextFunction } from 'express';
import {
  ExportPatientsUseCase,
  ExportPatientReportUseCase,
  ExportInvestigationUseCase
} from '@/application/use-cases';
import { HTTP_STATUS } from '@/shared/constants';

export class ExportController {
  constructor(
    private exportPatientsUseCase: ExportPatientsUseCase,
    private exportPatientReportUseCase: ExportPatientReportUseCase,
    private exportInvestigationUseCase: ExportInvestigationUseCase
  ) {}

  exportPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const buffer = await this.exportPatientsUseCase.execute(userId);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=patients.xlsx');
      res.status(HTTP_STATUS.OK).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  exportPatientReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const userId = (req as any).user.id;
      const buffer = await this.exportPatientReportUseCase.execute(patientId, userId);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=patient_${patientId}_report.xlsx`);
      res.status(HTTP_STATUS.OK).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  exportInvestigation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { investigationId } = req.params;
      const buffer = await this.exportInvestigationUseCase.execute(investigationId);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=investigation_${investigationId}.xlsx`);
      res.status(HTTP_STATUS.OK).send(buffer);
    } catch (error) {
      next(error);
    }
  };
}