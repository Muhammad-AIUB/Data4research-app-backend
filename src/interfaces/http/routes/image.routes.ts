import { Router } from 'express';
import { ImageController } from '../controllers';
import { authMiddleware, upload } from '../middlewares';

export const createImageRoutes = (imageController: ImageController) => {
  const router = Router();

  router.post('/patient/:patientId', authMiddleware, upload.single('image'), imageController.uploadPatientImage);
  router.get('/patient/:patientId', authMiddleware, imageController.getPatientImages);
  router.delete('/patient/:imageId', authMiddleware, imageController.deletePatientImage);

  router.post('/investigation/:investigationId', authMiddleware, upload.single('image'), imageController.uploadInvestigationImage);
  router.get('/investigation/:investigationId', authMiddleware, imageController.getInvestigationImages);

  return router;
};