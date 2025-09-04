/**
 * Environment configuration helper
 * Centralizes environment variable access with type safety and validation
 */

export const env = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
  
  // Database (Supabase)
  databaseUrl: process.env.DATABASE_URL!,
  directUrl: process.env.DIRECT_URL,
  
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
  },
  
  // Redis (Upstash)
  redis: {
    url: process.env.REDIS_URL!,
    restUrl: process.env.UPSTASH_REDIS_REST_URL!,
    restToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
  },
  
  // Authentication
  nextAuth: {
    url: process.env.NEXTAUTH_URL!,
    secret: process.env.NEXTAUTH_SECRET!,
  },
  
  // Blockchain
  blockchain: {
    chainId: Number(process.env.CHAIN_ID || '137'),
    rpcPolygon: process.env.RPC_URL_POLYGON,
    rpcEthereum: process.env.RPC_URL_ETHEREUM,
    alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  },
  
  // Feature Flags
  features: {
    ammEscrow: process.env.FEATURE_AMM_ESCROW === 'true',
    insurance: process.env.FEATURE_INSURANCE === 'true',
    zkAudit: process.env.FEATURE_ZK_AUDIT === 'true',
    crossborder: process.env.FEATURE_CROSSBORDER === 'true',
    simulation: process.env.FEATURE_SIMULATION === 'true',
    webAuthn: process.env.WEBAUTHN_REQUIRED === 'true',
  },
  
  // AI Agents
  agents: {
    feedstockMatcher: process.env.AGENT_FEEDSTOCK_MATCHER_ENABLED === 'true',
    traceBot: process.env.AGENT_TRACE_BOT_ENABLED === 'true',
    routeGen: process.env.AGENT_ROUTE_GEN_ENABLED === 'true',
    liquidityBot: process.env.AGENT_LIQUIDITY_BOT_ENABLED === 'true',
    loopAuditBot: process.env.AGENT_LOOP_AUDIT_BOT_ENABLED === 'true',
    executionMode: process.env.AGENT_EXECUTION_MODE || 'STANDARD',
  },
  
  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    rateLimitWindow: Number(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  },
  
  // Monitoring
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    sentryOrg: process.env.SENTRY_ORG,
    sentryProject: process.env.SENTRY_PROJECT,
  },
  
  // Third-party services
  services: {
    snykToken: process.env.SNYK_TOKEN,
    cloudflareToken: process.env.CLOUDFLARE_API_TOKEN,
  },
};

// Environment validation
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  
  if (process.env.NODE_ENV === 'production') {
    required.push(
      'REDIS_URL',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
      'SUPABASE_JWT_SECRET',
      'ENCRYPTION_KEY'
    );
  }
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\\n` +
      'Please check your .env.local file'
    );
  }
}

// Export typed config based on environment
export const config = {
  isDevelopment: env.nodeEnv === 'development',
  isProduction: env.nodeEnv === 'production',
  isTest: env.nodeEnv === 'test',
  ...env,
};
