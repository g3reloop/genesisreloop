import { NextRequest, NextResponse } from 'next/server';
import { cache } from '../redis/client';
import crypto from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string | ((req: NextRequest) => string); // Custom cache key
  revalidate?: boolean; // Force cache refresh
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Cache middleware for API routes
 * Usage: export const GET = withCache(handler, { ttl: 300 })
 */
export function withCache(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    // Skip caching for non-GET requests or if caching is disabled
    if (req.method !== 'GET' || process.env.DISABLE_CACHE === 'true') {
      return handler(req, context);
    }
    
    // Generate cache key
    const cacheKey = getCacheKey(req, options.key);
    
    // Check if we should revalidate
    const shouldRevalidate = options.revalidate || 
      req.headers.get('x-revalidate') === 'true' ||
      req.nextUrl.searchParams.get('revalidate') === 'true';
    
    // Try to get from cache if not revalidating
    if (!shouldRevalidate) {
      const cachedData = await cache.get<any>(`api:${cacheKey}`);
      if (cachedData) {
        // Return cached response
        return NextResponse.json(cachedData.data, {
          status: cachedData.status || 200,
          headers: {
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
            ...cachedData.headers,
          },
        });
      }
    }
    
    // Execute the handler
    const response = await handler(req, context);
    
    // Only cache successful responses
    if (response.status >= 200 && response.status < 300) {
      try {
        const data = await response.json();
        
        // Store in cache
        await cache.set(
          `api:${cacheKey}`,
          {
            data,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            timestamp: new Date().toISOString(),
          },
          options.ttl || 300 // Default 5 minutes
        );
        
        // Store cache tags for invalidation
        if (options.tags && options.tags.length > 0) {
          for (const tag of options.tags) {
            await cache.set(`tag:${tag}:${cacheKey}`, true, options.ttl || 300);
          }
        }
        
        // Return response with cache headers
        return NextResponse.json(data, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            'X-Cache': shouldRevalidate ? 'REVALIDATED' : 'MISS',
            'X-Cache-Key': cacheKey,
            'X-Cache-TTL': String(options.ttl || 300),
          },
        });
      } catch (error) {
        console.error('Cache storage error:', error);
        return response;
      }
    }
    
    return response;
  };
}

/**
 * Invalidate cache by tags
 */
export async function invalidateCache(tags: string[]): Promise<void> {
  for (const tag of tags) {
    const keys = await cache.clearPattern(`tag:${tag}:*`);
    console.log(`Invalidated ${keys} cache entries for tag: ${tag}`);
  }
}

/**
 * Generate cache key from request
 */
function getCacheKey(
  req: NextRequest,
  customKey?: string | ((req: NextRequest) => string)
): string {
  if (typeof customKey === 'function') {
    return customKey(req);
  }
  
  if (typeof customKey === 'string') {
    return customKey;
  }
  
  // Default key generation: URL + sorted query params
  const url = req.nextUrl.pathname;
  const params = Array.from(req.nextUrl.searchParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const keyString = `${url}?${params}`;
  
  // Hash the key to keep it short
  return crypto.createHash('sha256').update(keyString).digest('hex');
}

/**
 * Cache decorator for server actions
 */
export function cacheServerAction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number;
    keyFn?: (...args: Parameters<T>) => string;
    tags?: string[];
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    // Generate cache key
    const key = options.keyFn
      ? `action:${options.keyFn(...args)}`
      : `action:${fn.name}:${JSON.stringify(args)}`;
    
    // Try to get from cache
    const cached = await cache.get(key);
    if (cached) {
      return cached;
    }
    
    // Execute function
    const result = await fn(...args);
    
    // Cache the result
    await cache.set(key, result, options.ttl || 300);
    
    // Store cache tags
    if (options.tags) {
      for (const tag of options.tags) {
        await cache.set(`tag:${tag}:${key}`, true, options.ttl || 300);
      }
    }
    
    return result;
  }) as T;
}
