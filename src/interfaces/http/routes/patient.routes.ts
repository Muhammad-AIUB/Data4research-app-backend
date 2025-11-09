import { Router } from 'express';
import { PatientController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares/validator';
import { CreatePatientSchema, UpdatePatientSchema } from '@/application/validators';

export const createPatientRoutes = (patientController: PatientController) => {
  const router = Router();
  router.post('/', authMiddleware, validate(CreatePatientSchema), patientController.create);
  router.get('/', authMiddleware, patientController.list);
  router.get('/search', authMiddleware, patientController.search);
  router.get('/:id', authMiddleware, patientController.getById);
  router.put('/:id', authMiddleware, validate(UpdatePatientSchema), patientController.update);
  router.patch('/:id', authMiddleware, validate(UpdatePatientSchema), patientController.update);
  router.delete('/:id', authMiddleware, patientController.delete);
  return router;
};