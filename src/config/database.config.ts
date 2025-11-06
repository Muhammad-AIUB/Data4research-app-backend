/// <reference types="node" />
export const databaseConfig = {
  url: process.env.DATABASE_URL || '',
  poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10)
};