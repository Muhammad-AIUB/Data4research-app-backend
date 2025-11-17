// Entry point - Application starts here
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { v4 as uuid } from 'uuid';
import { appConfig } from '@/config/app.config';
import { connectDatabase } from '@/infrastructure/database/prisma/client';
import { createRoutes } from '@/interfaces/http/routes';
import { errorHandler, requestLogger, apiRateLimiter, speedLimiter, requestIdMiddleware } from '@/interfaces/http/middlewares';
import { logger } from '@/shared/utils';
import { PrismaUserRepository } from '@/infrastructure/database';
import { PasswordService } from '@/infrastructure/auth/PasswordService';
import { User } from '@/domain/entities';
import { getCacheService } from '@/infrastructure/cache';
import { redisConfig } from '@/config/redis.config';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigin }));

// Compression middleware (gzip responses)
app.use(compression());

// Request ID middleware (for tracking and debugging)
app.use(requestIdMiddleware);

// Request logging (before rate limiting to log all requests)
app.use(requestLogger);

// Rate limiting (apply to all routes)
app.use(apiRateLimiter);
app.use(speedLimiter);

// Body parser with size limits (production optimization)
app.use(express.json({ limit: '10mb' })); // Max 10MB JSON payload
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Max 10MB URL-encoded

// Enhanced health check endpoint with Redis status
app.get('/health', async (req, res) => {
  const cache = getCacheService();
  let redisStatus = 'disconnected';
  
  try {
    if (cache && typeof (cache as any).isConnected === 'function') {
      redisStatus = (cache as any).isConnected() ? 'connected' : 'disconnected';
    }
  } catch (error) {
    redisStatus = 'error';
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected', // Prisma connection is checked at startup
      redis: redisStatus
    }
  });
});

// API root endpoint - shows available routes
app.get(`/api/${appConfig.apiVersion}`, (req, res) => {
  res.json({
    success: true,
    message: 'Data4Research App API v1',
    endpoints: {
      auth: {
        register: `POST /api/${appConfig.apiVersion}/auth/register`,
        login: `POST /api/${appConfig.apiVersion}/auth/login`
      },
      patients: {
        create: `POST /api/${appConfig.apiVersion}/patients`,
        list: `GET /api/${appConfig.apiVersion}/patients?page=1&limit=10`,
        search: `GET /api/${appConfig.apiVersion}/patients/search?query=term&page=1&limit=10`,
        getById: `GET /api/${appConfig.apiVersion}/patients/:id`,
        update: `PUT /api/${appConfig.apiVersion}/patients/:id`,
        delete: `DELETE /api/${appConfig.apiVersion}/patients/:id`
      },
      dropdown: {
        getOptions: `GET /api/${appConfig.apiVersion}/dropdown/options`
      },
      clinicalData: {
        create: `POST /api/${appConfig.apiVersion}/clinical`,
        list: `GET /api/${appConfig.apiVersion}/clinical/:patientId/:section`,
        getById: `GET /api/${appConfig.apiVersion}/clinical/:entryId`,
        update: `PUT /api/${appConfig.apiVersion}/clinical/:entryId`,
        delete: `DELETE /api/${appConfig.apiVersion}/clinical/:entryId`
      },
      health: `GET /health`
    },
    baseUrl: `http://localhost:${appConfig.port}/api/${appConfig.apiVersion}`
  });
});

app.use(`/api/${appConfig.apiVersion}`, createRoutes());

app.use(errorHandler);

const ensureAdminUser = async () => {
  const { adminUsername, adminEmail, adminPassword } = appConfig;
  if (!adminUsername || !adminPassword) {
    logger.warn('Admin credentials are not configured. Skipping default admin creation.');
    return;
  }

  const userRepository = new PrismaUserRepository();
  const passwordService = new PasswordService();

  const existingAdmin = await userRepository.findByUsername(adminUsername);
  if (existingAdmin) {
    logger.info(`Admin user already exists (username: ${adminUsername}).`);
    return;
  }

  const passwordHash = await passwordService.hash(adminPassword);
  const adminUser = User.create({
    id: uuid(),
    username: adminUsername,
    email: adminEmail,
    passwordHash
  });

  await userRepository.save(adminUser);
  logger.info(`Default admin user created (username: ${adminUsername}).`);
};

const startServer = async (): Promise<void> => {
  console.log(`🚀 Starting Data4Research App Backend...`);
  console.log(`📍 Environment: ${appConfig.nodeEnv}`);
  console.log(`🌐 Port: ${appConfig.port}`);
  
  // Initialize database connection
  try {
    await connectDatabase();
  } catch (error) {
    console.error('❌ Failed to connect to database. Please check your DATABASE_URL and ensure the database is running.');
    console.error('💡 Run "npm run test:db" to diagnose database connection issues.');
    process.exit(1);
  }
  
  await ensureAdminUser();
  
  // Initialize Redis cache (Required for production performance)
  try {
    const cache = getCacheService();
    
    // Check if Redis is configured
    const hasUpstashConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    const hasStandardRedisConfig = !!(process.env.REDIS_URL || process.env.REDIS_HOST) && 
                                    process.env.REDIS_URL !== 'redis://localhost:6379';
    const hasRedisConfig = hasUpstashConfig || hasStandardRedisConfig;
    
    if (hasRedisConfig) {
      // Redis is configured - check connection
      if (cache && typeof (cache as any).isConnected === 'function') {
        const isConnected = (cache as any).isConnected();
        if (isConnected) {
          logger.info('✅ Redis cache connected and ready');
        } else {
          // For standard Redis with lazy connect, it will connect on first use
          // For Upstash, it's always "connected" via REST API
          logger.info('✅ Redis cache service initialized (will connect on first use)');
        }
      } else {
        logger.info('✅ Redis cache service initialized');
      }
    } else {
      // Redis not configured - show warning for production
      if (appConfig.nodeEnv === 'production') {
        logger.warn('⚠️  Redis cache not configured - Performance may be impacted in production');
        logger.warn('💡 Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env for optimal performance');
      } else {
        logger.info('ℹ️  Redis cache not configured (recommended for production performance)');
      }
    }
  } catch (error) {
    logger.error('❌ Redis cache initialization failed:', error);
    if (appConfig.nodeEnv === 'production') {
      logger.warn('⚠️  Continuing without cache - Performance will be impacted');
    }
  }
  
  // Start HTTP server
  app.listen(appConfig.port, () => {
    logger.info(`Server running on port ${appConfig.port}`);
    logger.info(`Environment: ${appConfig.nodeEnv}`);
    logger.info(`API Version: ${appConfig.apiVersion}`);
    console.log(`✅ Server ready!`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  // Don't exit in production, just log
  if (appConfig.nodeEnv === 'development') {
    console.error('Unhandled Rejection:', reason);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  console.error('❌ Uncaught Exception:', error);
  // Exit process for uncaught exceptions (critical)
  process.exit(1);
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close server
    if (app.listening) {
      await new Promise<void>((resolve) => {
        app.close(() => {
          logger.info('HTTP server closed');
          resolve();
        });
      });
    }

    // Disconnect database
    const { disconnectDatabase } = await import('@/infrastructure/database/prisma/client');
    await disconnectDatabase();
    logger.info('Database disconnected');

    // Disconnect Redis cache
    const cache = getCacheService();
    if (cache && typeof (cache as any).disconnect === 'function') {
      await (cache as any).disconnect();
      logger.info('Redis cache disconnected');
    }

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;

