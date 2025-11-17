import { Redis } from '@upstash/redis';
import RedisClient from 'ioredis';
import { redisConfig } from '@/config/redis.config';
import { logger } from '@/shared/utils';

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

/**
 * Redis Cache Service
 * Supports both Upstash (serverless) and standard Redis
 */
export class RedisCacheService implements ICacheService {
  private upstashClient: Redis | null = null;
  private ioredisClient: RedisClient | null = null;
  private isUpstash: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Check if Upstash credentials are provided
    if (redisConfig.url && redisConfig.token) {
      try {
        this.upstashClient = new Redis({
          url: redisConfig.url,
          token: redisConfig.token,
        });
        this.isUpstash = true;
        logger.info('✅ Redis cache initialized (Upstash)');
      } catch (error) {
        logger.warn('Failed to initialize Upstash Redis, falling back to standard Redis', error);
      }
    }

    // Fallback to standard Redis if Upstash is not configured
    if (!this.isUpstash) {
      const redisUrl = redisConfig.redisUrl;
      if (redisUrl) {
        try {
          this.ioredisClient = new RedisClient(redisUrl, {
            retryStrategy: (times) => {
              const delay = Math.min(times * 50, 2000);
              return delay;
            },
            maxRetriesPerRequest: 3,
            lazyConnect: true, // Don't connect immediately, wait for first operation
          });

          this.ioredisClient.on('connect', () => {
            logger.info('✅ Redis cache initialized (Standard Redis)');
          });

          this.ioredisClient.on('error', (error) => {
            logger.warn('Redis connection error (cache will be disabled):', error.message);
          });
        } catch (error) {
          logger.warn('Failed to initialize Redis cache:', error);
        }
      } else {
        // Redis is optional - no warning needed if not configured
        // This is expected behavior when Redis credentials are not provided
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isUpstash && this.upstashClient) {
        const value = await this.upstashClient.get<T>(key);
        return value;
      } else if (this.ioredisClient) {
        const value = await this.ioredisClient.get(key);
        if (!value) return null;
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      logger.warn(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      if (this.isUpstash && this.upstashClient) {
        if (ttlSeconds) {
          await this.upstashClient.set(key, value, { ex: ttlSeconds });
        } else {
          await this.upstashClient.set(key, value);
        }
      } else if (this.ioredisClient) {
        const serialized = JSON.stringify(value);
        if (ttlSeconds) {
          await this.ioredisClient.setex(key, ttlSeconds, serialized);
        } else {
          await this.ioredisClient.set(key, serialized);
        }
      }
    } catch (error) {
      logger.warn(`Cache set error for key ${key}:`, error);
      // Don't throw - cache failures shouldn't break the app
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.isUpstash && this.upstashClient) {
        await this.upstashClient.del(key);
      } else if (this.ioredisClient) {
        await this.ioredisClient.del(key);
      }
    } catch (error) {
      logger.warn(`Cache delete error for key ${key}:`, error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.isUpstash && this.upstashClient) {
        // Upstash doesn't support SCAN, so we'll use a workaround
        // For production, consider using Upstash's key expiration or manual key management
        logger.warn('Pattern deletion not fully supported with Upstash. Consider using specific keys.');
      } else if (this.ioredisClient) {
        const stream = this.ioredisClient.scanStream({
          match: pattern,
          count: 100,
        });

        const pipeline = this.ioredisClient.pipeline();
        let keysCount = 0;

        stream.on('data', (keys: string[]) => {
          keys.forEach((key) => {
            pipeline.del(key);
            keysCount++;
          });
        });

        stream.on('end', async () => {
          if (keysCount > 0) {
            await pipeline.exec();
            logger.info(`Deleted ${keysCount} cache keys matching pattern: ${pattern}`);
          }
        });
      }
    } catch (error) {
      logger.warn(`Cache deletePattern error for pattern ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.isUpstash && this.upstashClient) {
        const result = await this.upstashClient.exists(key);
        return result === 1;
      } else if (this.ioredisClient) {
        const result = await this.ioredisClient.exists(key);
        return result === 1;
      }
      return false;
    } catch (error) {
      logger.warn(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isUpstash && this.upstashClient) {
        // Upstash doesn't support FLUSHALL in REST API
        logger.warn('Clear all cache not supported with Upstash REST API');
      } else if (this.ioredisClient) {
        await this.ioredisClient.flushdb();
        logger.info('Cache cleared');
      }
    } catch (error) {
      logger.warn('Cache clear error:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.ioredisClient) {
        await this.ioredisClient.quit();
      }
      // Upstash REST API doesn't need explicit disconnection
    } catch (error) {
      logger.warn('Redis disconnect error:', error);
    }
  }

  isConnected(): boolean {
    if (this.isUpstash && this.upstashClient) {
      return true; // Upstash REST API is always "connected"
    }
    if (this.ioredisClient) {
      return this.ioredisClient.status === 'ready';
    }
    return false;
  }
}

// Singleton instance
let cacheServiceInstance: RedisCacheService | null = null;

export const getCacheService = (): ICacheService => {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new RedisCacheService();
  }
  return cacheServiceInstance;
};

