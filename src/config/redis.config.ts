/// <reference types="node" />
export const redisConfig = {
  // Upstash Redis (serverless) - recommended for production
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  
  // Standard Redis (fallback or local development)
  redisUrl: process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://localhost:6379',
  
  // Cache TTL defaults (in seconds)
  defaultTtl: parseInt(process.env.REDIS_DEFAULT_TTL || '3600', 10), // 1 hour
  dropdownTtl: parseInt(process.env.REDIS_DROPDOWN_TTL || '86400', 10), // 24 hours
  patientListTtl: parseInt(process.env.REDIS_PATIENT_LIST_TTL || '300', 10), // 5 minutes
};