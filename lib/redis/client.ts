import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { config } from '../config/env';

// Initialize Redis client
export const redis = new Redis({
  url: config.redis.restUrl,
  token: config.redis.restToken,
});

// Rate limiting configurations
export const rateLimiter = {
  // API rate limiter - 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      config.security.rateLimitMax,
      `${config.security.rateLimitWindow}ms`
    ),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
  
  // Auth rate limiter - 5 attempts per 15 minutes
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),
  
  // Heavy operations rate limiter - 10 per hour
  heavy: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:heavy',
  }),
};

// Cache utilities
export const cache = {
  // Get cached value with type safety
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  
  // Set cached value with optional TTL (in seconds)
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },
  
  // Delete cached value
  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },
  
  // Clear cache by pattern
  async clearPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        const result = await redis.del(...keys);
        return result;
      }
      return 0;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return 0;
    }
  },
  
  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },
};

// Session management
export const session = {
  // Store session data
  async set(sessionId: string, data: any, ttl = 86400): Promise<void> {
    await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
  },
  
  // Get session data
  async get(sessionId: string): Promise<any | null> {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data as string) : null;
  },
  
  // Delete session
  async del(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
  },
  
  // Refresh session TTL
  async refresh(sessionId: string, ttl = 86400): Promise<void> {
    await redis.expire(`session:${sessionId}`, ttl);
  },
};

// Queue management (for background jobs)
export const queue = {
  // Add job to queue
  async push(queueName: string, job: any): Promise<void> {
    await redis.rpush(`queue:${queueName}`, JSON.stringify(job));
  },
  
  // Get job from queue (FIFO)
  async pop(queueName: string): Promise<any | null> {
    const job = await redis.lpop(`queue:${queueName}`);
    return job ? JSON.parse(job as string) : null;
  },
  
  // Get queue length
  async length(queueName: string): Promise<number> {
    return await redis.llen(`queue:${queueName}`);
  },
};

// Pub/Sub for real-time features
export const pubsub = {
  // Publish message to channel
  async publish(channel: string, message: any): Promise<void> {
    await redis.publish(channel, JSON.stringify(message));
  },
  
  // Note: Upstash Redis REST API doesn't support subscribe
  // For real-time, use Socket.io or similar
};

// Cache key generators
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  batch: (id: string) => `batch:${id}`,
  route: (id: string) => `route:${id}`,
  supplier: (id: string) => `supplier:${id}`,
  processor: (id: string) => `processor:${id}`,
  agentResult: (agent: string, input: string) => `agent:${agent}:${input}`,
  marketData: (type: string) => `market:${type}`,
  compliance: (batchId: string) => `compliance:${batchId}`,
};
