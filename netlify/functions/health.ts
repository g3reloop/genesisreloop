import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const startTime = Date.now();
  const checks = {
    function: 'ok',
    database: 'unknown',
    redis: 'unknown',
    timestamp: new Date().toISOString(),
    version: process.env.DEPLOY_ID || 'local',
    latency: {
      database: 0,
      redis: 0,
      total: 0,
    },
  };

  try {
    // Check database connection
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from('User').select('id').limit(1);
    checks.database = dbError ? 'error' : 'ok';
    checks.latency.database = Date.now() - dbStart;

    // Check Redis connection
    const redisStart = Date.now();
    await redis.ping();
    checks.redis = 'ok';
    checks.latency.redis = Date.now() - redisStart;
  } catch (error) {
    checks.redis = 'error';
  }

  checks.latency.total = Date.now() - startTime;

  const statusCode = 
    checks.database === 'ok' && checks.redis === 'ok' ? 200 : 503;

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    body: JSON.stringify(checks, null, 2),
  };
};
