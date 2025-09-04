import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '../redis/client';
import type { RatelimitResponse } from '@upstash/ratelimit';

export interface RateLimitOptions {
  identifier?: string | ((req: NextRequest) => string); // Custom identifier
  limiter?: 'api' | 'auth' | 'heavy'; // Which rate limiter to use
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

/**
 * Rate limiting middleware for API routes
 * Usage: export const POST = withRateLimit(handler, { limiter: 'auth' })
 */
export function withRateLimit(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: RateLimitOptions = {}
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    // Skip rate limiting in development if configured
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DISABLE_RATE_LIMIT === 'true'
    ) {
      return handler(req, context);
    }
    
    // Get identifier (IP address by default)
    const identifier = getIdentifier(req, options.identifier);
    
    // Select rate limiter
    const limiter = rateLimiter[options.limiter || 'api'];
    
    // Check rate limit
    const result = await limiter.limit(identifier);
    
    // Add rate limit headers
    const headers = getRateLimitHeaders(result);
    
    // If rate limited, return 429
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'You have exceeded the rate limit. Please try again later.',
          retryAfter: Math.ceil(result.reset / 1000),
        },
        {
          status: 429,
          headers,
        }
      );
    }
    
    // Execute handler
    const response = await handler(req, context);
    
    // Optionally refund the request based on response
    if (
      (options.skipSuccessfulRequests && response.status < 400) ||
      (options.skipFailedRequests && response.status >= 400)
    ) {
      // Note: Upstash doesn't support refunding, so we'll need to track this separately
      // This is a limitation of the REST API approach
    }
    
    // Add rate limit headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

/**
 * Rate limit check without blocking (for conditional logic)
 */
export async function checkRateLimit(
  identifier: string,
  limiter: 'api' | 'auth' | 'heavy' = 'api'
): Promise<RatelimitResponse> {
  return await rateLimiter[limiter].limit(identifier);
}

/**
 * Get identifier for rate limiting
 */
function getIdentifier(
  req: NextRequest,
  customIdentifier?: string | ((req: NextRequest) => string)
): string {
  if (typeof customIdentifier === 'function') {
    return customIdentifier(req);
  }
  
  if (typeof customIdentifier === 'string') {
    return customIdentifier;
  }
  
  // Try to get IP address
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || 
    (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
    realIp ||
    'unknown';
  
  return ip;
}

/**
 * Generate rate limit headers
 */
function getRateLimitHeaders(result: RatelimitResponse): Record<string, string> {
  const now = Date.now();
  const reset = new Date(result.reset).toISOString();
  
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': reset,
    'X-RateLimit-Retry-After': result.success 
      ? '0' 
      : Math.ceil((result.reset - now) / 1000).toString(),
  };
}

/**
 * Rate limit decorator for server actions
 */
export function rateLimitServerAction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    identifier: (...args: Parameters<T>) => string;
    limiter?: 'api' | 'auth' | 'heavy';
    errorMessage?: string;
  }
): T {
  return (async (...args: Parameters<T>) => {
    const identifier = options.identifier(...args);
    const limiter = rateLimiter[options.limiter || 'api'];
    
    const result = await limiter.limit(identifier);
    
    if (!result.success) {
      throw new Error(
        options.errorMessage || 
        `Rate limit exceeded. Try again in ${Math.ceil((result.reset - Date.now()) / 1000)} seconds.`
      );
    }
    
    return fn(...args);
  }) as T;
}

/**
 * IP-based rate limiting for authentication endpoints
 */
export const authRateLimit = (req: NextRequest) => 
  withRateLimit(
    async (req: NextRequest) => NextResponse.next(),
    { limiter: 'auth' }
  )(req);

/**
 * User-based rate limiting for authenticated endpoints
 */
export function userRateLimit(userId: string) {
  return (handler: (req: NextRequest, context?: any) => Promise<NextResponse>) =>
    withRateLimit(handler, {
      identifier: () => `user:${userId}`,
      limiter: 'api',
    });
}
