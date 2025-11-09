import { Router } from 'express';
import { AuthController } from '../controllers';
import { validate } from '../middlewares/validator';
import { RegisterSchema, LoginSchema } from '@/application/validators';

export const createAuthRoutes = (authController: AuthController) => {
  const router = Router();
  router.post('/register', validate(RegisterSchema), authController.register);
  router.post('/login', validate(LoginSchema), authController.login);
  return router;
};