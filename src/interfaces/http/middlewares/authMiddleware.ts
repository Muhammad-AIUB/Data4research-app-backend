import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/errors';
import { JWTService } from '@/infrastructure/auth/JWTService';

const jwtService = new JWTService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = jwtService.verifyToken(token);

    (req as any).user = {
      id: decoded.id,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
};