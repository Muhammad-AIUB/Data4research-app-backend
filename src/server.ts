// Entry point - Application starts here
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { appConfig } from '@/config/app.config';
import { connectDatabase } from '@/infrastructure/database/prisma/client';
import { createRoutes } from '@/interfaces/http/routes';
import { errorHandler } from '@/interfaces/http/middlewares';
import { logger } from '@/shared/utils';

const app = express();

app.use(helmet());
app.use(cors({ origin: appConfig.corsOrigin }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API root endpoint - shows available routes
app.get(`/api/${appConfig.apiVersion}`, (req, res) => {
  res.json({
    success: true,
    message: 'Medical App API v1',
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
      health: `GET /health`
    },
    baseUrl: `http://localhost:${appConfig.port}/api/${appConfig.apiVersion}`
  });
});

app.use(`/api/${appConfig.apiVersion}`, createRoutes());

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  console.log(`🚀 Starting Medical App Backend...`);
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
  
  // TODO: Initialize Redis cache
  
  // Start HTTP server
  app.listen(appConfig.port, () => {
    logger.info(`Server running on port ${appConfig.port}`);
    logger.info(`Environment: ${appConfig.nodeEnv}`);
    logger.info(`API Version: ${appConfig.apiVersion}`);
    console.log(`✅ Server ready!`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;

