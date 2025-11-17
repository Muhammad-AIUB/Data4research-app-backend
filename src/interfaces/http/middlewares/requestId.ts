import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * Request ID Middleware
 * Adds unique request ID to each request for better tracking and debugging
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Generate or use existing request ID
  const requestId = (req.headers['x-request-id'] as string) || uuid();
  
  // Add to request object
  (req as any).requestId = requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

