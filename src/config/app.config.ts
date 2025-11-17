interface AppConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
  corsOrigin: string[];
  jwtSecret: string;
  jwtExpiresIn: string;
  adminUsername: string;
  adminEmail?: string;
  adminPassword: string;
}

const defaultAdminEmail = process.env.ADMIN_EMAIL || 'bslctr2022@gmail.com';
const defaultAdminUsername = process.env.ADMIN_USERNAME || defaultAdminEmail || 'admin';

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  adminUsername: defaultAdminUsername,
  adminEmail: defaultAdminEmail,
  adminPassword: process.env.ADMIN_PASSWORD || 'Bslctr@253027'
};