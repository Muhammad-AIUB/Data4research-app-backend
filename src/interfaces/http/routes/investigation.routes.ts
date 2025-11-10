import { Router } from 'express';
import { InvestigationController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares/validator';
import { CreateInvestigationSchema } from '@/application/validators';

export const createInvestigationRoutes = (investigationController: InvestigationController) => {
  const router = Router();
  router.post('/', authMiddleware, validate(CreateInvestigationSchema), investigationController.create);
  router.get('/:id', authMiddleware, investigationController.getById);
  router.get('/patient/:patientId', authMiddleware, investigationController.listByPatient);
  router.delete('/:id', authMiddleware, investigationController.delete);
  return router;
};