import { Router } from 'express';
import { AuthController } from '../controllers';
import { validate } from '../middlewares/validator';
import { authRateLimiter } from '../middlewares/rateLimiter';
import { RegisterSchema, LoginSchema } from '@/application/validators';

export const createAuthRoutes = (authController: AuthController) => {
  const router = Router();
  // Apply strict rate limiting to auth endpoints
  router.post('/register', authRateLimiter, validate(RegisterSchema), authController.register);
  router.post('/login', authRateLimiter, validate(LoginSchema), authController.login);
  return router;
};