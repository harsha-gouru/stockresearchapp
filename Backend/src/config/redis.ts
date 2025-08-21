import Redis from 'ioredis';
import { config } from './environment.js';

let redis: Redis;

export async function connectRedis(): Promise<Redis> {
  try {
    const redisConfig: any = {
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
    };

    // Only add password if it exists
    if (config.redis.password) {
      redisConfig.password = config.redis.password;
    }

    redis = new Redis(redisConfig);

    // Event listeners
    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });

    redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    // Test the connection
    await redis.ping();
    
    return redis;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return redis;
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.disconnect();
    console.log('✅ Redis connection closed');
  }
}

// Cache helper functions
export async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const serialized = JSON.stringify(value);
  
  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, serialized);
  } else {
    await redis.set(key, serialized);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  
  if (!cached) {
    return null;
  }
  
  try {
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Rate limiting helper
export async function rateLimitCheck(
  key: string, 
  limit: number, 
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  
  const ttl = await redis.ttl(key);
  const resetTime = Date.now() + (ttl * 1000);
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetTime,
  };
}
