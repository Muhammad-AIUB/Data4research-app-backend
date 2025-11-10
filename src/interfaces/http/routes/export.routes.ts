import { Router } from 'express';
import { ExportController } from '../controllers';
import { authMiddleware } from '../middlewares';

export const createExportRoutes = (exportController: ExportController) => {
  const router = Router();
  router.get('/patients', authMiddleware, exportController.exportPatients);
  router.get('/patient/:patientId', authMiddleware, exportController.exportPatientReport);
  router.get('/investigation/:investigationId', authMiddleware, exportController.exportInvestigation);
  return router;
};