import { Router } from 'express';
import { ClinicalDataController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { validate } from '../middlewares/validator';
import { ClinicalEntrySchema, ClinicalEntryUpdateSchema } from '@/application/validators';

export const createClinicalRoutes = (clinicalController: ClinicalDataController) => {
  const router = Router();

  router.post(
    '/:patientId/clinical',
    authMiddleware,
    validate(ClinicalEntrySchema),
    clinicalController.create
  );

  router.get('/:patientId/clinical', authMiddleware, clinicalController.list);

  router.put(
    '/:patientId/clinical/:entryId',
    authMiddleware,
    validate(ClinicalEntryUpdateSchema),
    clinicalController.update
  );

  router.delete('/:patientId/clinical/:entryId', authMiddleware, clinicalController.delete);

  return router;
};

