import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils';

/**
 * Request logging middleware
 * Logs request method, path, IP, response time, status code, and request ID
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;
  const requestId = (req as any).requestId || 'unknown';
  const userId = (req as any).user?.id || 'anonymous';

  // Log request
  logger.info('Incoming request', {
    requestId,
    method,
    path: originalUrl,
    ip: ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
    userId,
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: () => void): Response {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Log response with performance metrics
    logger.info('Request completed', {
      requestId,
      method,
      path: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      durationMs: duration,
      ip: ip || req.socket.remoteAddress,
      userId,
      // Performance warning for slow requests
      ...(duration > 1000 && { warning: 'Slow request detected' }),
    });

    // Call original end
    if (typeof chunk === 'function') {
      return originalEnd(chunk);
    } else if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding);
    } else if (typeof cb === 'function') {
      return originalEnd(chunk, encoding, cb);
    } else {
      return originalEnd(chunk, encoding);
    }
  };

  next();
};

