import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, NotFoundError, UnauthorizedError } from '@/shared/errors';
import { HTTP_STATUS } from '@/shared/constants';
import { logger } from '@/shared/utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred', { error: err.message, stack: err.stack, path: req.path, method: req.method });

  if (err instanceof ValidationError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: { type: 'ValidationError', message: err.message, statusCode: HTTP_STATUS.BAD_REQUEST } });
  }

  if (err instanceof NotFoundError) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: { type: 'NotFoundError', message: err.message, statusCode: HTTP_STATUS.NOT_FOUND } });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, error: { type: 'UnauthorizedError', message: err.message, statusCode: HTTP_STATUS.UNAUTHORIZED } });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: { type: err.name, message: err.message, statusCode: err.statusCode } });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: { type: 'InternalServerError', message: 'Internal server error', statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR } });
};