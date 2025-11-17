import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, NotFoundError, UnauthorizedError } from '@/shared/errors';
import { HTTP_STATUS } from '@/shared/constants';
import { logger } from '@/shared/utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = (req as any).requestId || 'unknown';
  const userId = (req as any).user?.id || 'anonymous';
  
  logger.error('Error occurred', { 
    requestId,
    error: err.message, 
    stack: err.stack, 
    path: req.path, 
    method: req.method,
    userId,
    ip: req.ip || req.socket.remoteAddress,
    body: req.method !== 'GET' ? req.body : undefined, // Log body for non-GET requests
  });

  // Include request ID in error response for better debugging
  const errorResponse = (statusCode: number, type: string, message: string) => {
    return res.status(statusCode).json({ 
      success: false, 
      error: { 
        type, 
        message, 
        statusCode,
        requestId: requestId // Include request ID for debugging
      } 
    });
  };

  if (err instanceof ValidationError) {
    return errorResponse(HTTP_STATUS.BAD_REQUEST, 'ValidationError', err.message);
  }

  if (err instanceof NotFoundError) {
    return errorResponse(HTTP_STATUS.NOT_FOUND, 'NotFoundError', err.message);
  }

  if (err instanceof UnauthorizedError) {
    return errorResponse(HTTP_STATUS.UNAUTHORIZED, 'UnauthorizedError', err.message);
  }

  if (err instanceof AppError) {
    return errorResponse(err.statusCode, err.name, err.message);
  }

  return errorResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'InternalServerError', 'Internal server error');
};