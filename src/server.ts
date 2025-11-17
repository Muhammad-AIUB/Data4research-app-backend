// Entry point - Application starts here
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { v4 as uuid } from 'uuid';
import { appConfig } from '@/config/app.config';
import { connectDatabase } from '@/infrastructure/database/prisma/client';
import { createRoutes } from '@/interfaces/http/routes';
import { errorHandler } from '@/interfaces/http/middlewares';
import { logger } from '@/shared/utils';
import { PrismaUserRepository } from '@/infrastructure/database';
import { PasswordService } from '@/infrastructure/auth/PasswordService';
import { User } from '@/domain/entities';

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

