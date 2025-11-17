import { Router } from 'express';
import { DropdownController } from '../controllers';

export const createDropdownRoutes = (dropdownController: DropdownController) => {
  const router = Router();
  router.get('/options', dropdownController.getOptions);
  return router;
};

