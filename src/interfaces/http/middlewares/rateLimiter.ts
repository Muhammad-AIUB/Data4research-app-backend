import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response } from 'express';

/**
 * General API Rate Limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
        type: 'RateLimitError'
      }
    });
  }
});

/**
 * Strict Rate Limiter for Auth endpoints
 * Limits: 5 requests per 15 minutes per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again later.',
      type: 'RateLimitError'
    }
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many login attempts, please try again later.',
        type: 'RateLimitError'
      }
    });
  }
});

/**
 * Slow Down middleware - gradually slow down repeated requests
 * Adds 100ms delay per request after 50 requests in 15 minutes
 */
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: () => 100, // Add 100ms delay per request after delayAfter (new v2 syntax)
  maxDelayMs: 2000, // Maximum delay of 2 seconds
  validate: {
    delayMs: false // Disable validation warning
  }
});

