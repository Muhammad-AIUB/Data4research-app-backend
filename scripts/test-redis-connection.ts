/**
 * Redis Connection Test Script
 * 
 * This script tests the Redis connection to help diagnose connection issues.
 * Run with: npx tsx scripts/test-redis-connection.ts
 */

import 'dotenv/config';
import { Redis } from '@upstash/redis';
import RedisClient from 'ioredis';

async function testRedisConnection() {
  console.log('🔍 Testing Redis connection...\n');

  // Check if Redis is actually configured (not just empty strings or placeholders)
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const redisUrl = (process.env.REDIS_URL || process.env.REDIS_HOST)?.trim();
  
  const hasUpstashConfig = !!(upstashUrl && upstashToken && 
                               upstashUrl !== '' && upstashToken !== '' &&
                               !upstashUrl.includes('your-upstash') && 
                               !upstashToken.includes('your-upstash'));
  const hasStandardRedisConfig = !!(redisUrl && 
                                     redisUrl !== '' && 
                                     redisUrl !== 'redis://localhost:6379' &&
                                     !redisUrl.includes('your-redis'));

  if (!hasUpstashConfig && !hasStandardRedisConfig) {
    console.error('❌ Redis is not configured!');
    console.log('\n📝 Please add Redis credentials to your .env file:');
    console.log('\n   Option 1: Upstash (Recommended for production)');
    console.log('   Get credentials from: https://console.upstash.com');
    console.log('   UPSTASH_REDIS_REST_URL=https://your-actual-url.upstash.io');
    console.log('   UPSTASH_REDIS_REST_TOKEN=your-actual-token-here');
    console.log('\n   Option 2: Standard Redis');
    console.log('   REDIS_URL=redis://your-actual-redis-host:6379');
    console.log('   OR');
    console.log('   REDIS_HOST=redis://your-actual-redis-host:6379');
    console.log('\n💡 Make sure to:');
    console.log('   - Remove placeholder values (your-upstash-url, your-upstash-token)');
    console.log('   - Add actual credentials from Upstash console');
    console.log('   - Restart server after updating .env');
    process.exit(1);
  }

  // Test Upstash Redis
  if (hasUpstashConfig) {
    console.log('🔄 Testing Upstash Redis connection...');
    try {
      const upstashClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });

      // Test connection with a simple operation
      await upstashClient.set('test:connection', 'ok', { ex: 10 });
      const value = await upstashClient.get('test:connection');
      await upstashClient.del('test:connection');

      if (value === 'ok') {
        console.log('✅ Upstash Redis connection successful!\n');
        console.log('📊 Connection Details:');
        console.log(`   Type: Upstash (Serverless)`);
        console.log(`   URL: ${process.env.UPSTASH_REDIS_REST_URL?.substring(0, 30)}...`);
        return;
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error: any) {
      console.error('❌ Upstash Redis connection failed!\n');
      console.error('Error:', error.message);
      console.log('\n💡 Possible solutions:');
      console.log('   1. Verify your UPSTASH_REDIS_REST_URL is correct');
      console.log('   2. Verify your UPSTASH_REDIS_REST_TOKEN is correct');
      console.log('   3. Check your Upstash dashboard for active database');
      process.exit(1);
    }
  }

  // Test Standard Redis
  if (hasStandardRedisConfig) {
    console.log('🔄 Testing Standard Redis connection...');
    const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST || 'redis://localhost:6379';
    
    try {
      const redisClient = new RedisClient(redisUrl, {
        retryStrategy: () => null, // Don't retry for test
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
      });

      await new Promise<void>((resolve, reject) => {
        redisClient.on('connect', () => {
          console.log('✅ Standard Redis connection successful!\n');
          console.log('📊 Connection Details:');
          console.log(`   Type: Standard Redis`);
          console.log(`   URL: ${redisUrl}`);
          resolve();
        });

        redisClient.on('error', (error) => {
          reject(error);
        });

        // Test with a simple operation
        redisClient.connect().then(() => {
          return redisClient.set('test:connection', 'ok', 'EX', 10);
        }).then(() => {
          return redisClient.get('test:connection');
        }).then((value) => {
          if (value === 'ok') {
            return redisClient.del('test:connection');
          }
        }).then(() => {
          redisClient.quit();
          resolve();
        }).catch(reject);
      });
    } catch (error: any) {
      console.error('❌ Standard Redis connection failed!\n');
      console.error('Error:', error.message);
      console.log('\n💡 Possible solutions:');
      console.log('   1. Verify your REDIS_URL is correct');
      console.log('   2. Check if Redis server is running');
      console.log('   3. Check firewall/network settings');
      console.log('   4. Verify Redis server is accessible from your network');
      process.exit(1);
    }
  }

  console.log('\n✅ All Redis tests passed! Cache is ready to use.');
}

testRedisConnection().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

