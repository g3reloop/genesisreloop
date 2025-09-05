# Netlify Production Environment Variables Setup Guide

This guide will help you set up all required environment variables for deploying the ReLoop platform to Netlify.

## Prerequisites

Before you begin, you'll need:
1. A Netlify account with your site deployed
2. A Supabase project (or create one at https://supabase.com)
3. An OpenRouter API key (get one at https://openrouter.ai)
4. A Stripe account (optional, for payments)
5. Blockchain RPC endpoints (optional, for Web3 features)

## Setting Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (reloop-platform)
3. Navigate to "Site configuration" → "Environment variables"
4. Click "Add a variable" and add each of the following:

## Required Environment Variables

### 1. Basic Configuration

```bash
# Site URL (update with your actual domain)
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app

# Node environment
NODE_ENV=production
```

### 2. Supabase Configuration (Required for Auth & Database)

If you don't have Supabase set up, the app will work in limited mode. To get these values:
1. Go to https://supabase.com and create a new project
2. Go to Project Settings → API
3. Copy the values below:

```bash
# From Supabase Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key-from-supabase]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key-from-supabase]

# Optional - from Project Settings → Database
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 3. OpenRouter AI Configuration (Required for AI Features)

Get your API key from https://openrouter.ai/keys

```bash
OPENROUTER_API_KEY=sk-or-v1-[your-key-here]
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3-opus
OPENROUTER_SITE_URL=https://your-site-name.netlify.app
OPENROUTER_SITE_NAME=Genesis Reloop Platform
```

### 4. Authentication Secrets (Required)

Generate secure secrets using:
```bash
openssl rand -base64 32
```

```bash
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=[generate-with-openssl-command-above]
JWT_SECRET=[generate-with-openssl-command-above]
```

### 5. Redis Configuration (Optional - for caching)

You can use Upstash Redis (free tier available):
1. Sign up at https://upstash.com
2. Create a Redis database
3. Copy the credentials:

```bash
REDIS_URL=redis://default:[YOUR-PASSWORD]@[YOUR-ENDPOINT].upstash.io:[PORT]
UPSTASH_REDIS_REST_URL=https://[YOUR-ENDPOINT].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-rest-token]
```

### 6. Blockchain Configuration (Optional - for Web3 features)

```bash
# Chain configuration
NEXT_PUBLIC_CHAIN_ID=137
CHAIN_ID=137

# RPC URLs (you can use public endpoints or get your own from Alchemy/Infura)
NEXT_PUBLIC_RPC_URL_POLYGON=https://polygon-rpc.com
NEXT_PUBLIC_RPC_URL_ETHEREUM=https://eth.llamarpc.com
RPC_URL_POLYGON=https://polygon-rpc.com
RPC_URL_ETHEREUM=https://eth.llamarpc.com

# Contract addresses (use zeros if not deployed yet)
NEXT_PUBLIC_ESCROW_VAULT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_AMM_POOL_CARBON_USDC_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_AMM_POOL_UCO_USDC_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_INSURANCE_POLICY_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_DAO_PARAMS_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_CARBON_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_UCO_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_GIRM_ENFORCEMENT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_SRL_REPUTATION_ADDRESS=0x0000000000000000000000000000000000000000
```

### 7. Stripe Configuration (Optional - for payments)

Get these from https://dashboard.stripe.com/apikeys

```bash
STRIPE_SECRET_KEY=sk_live_[your-live-secret-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-publishable-key]

# Price IDs (create products in Stripe dashboard first)
NEXT_PUBLIC_STRIPE_BASIC_LOOP_PRICE_ID=price_[your-price-id]
NEXT_PUBLIC_STRIPE_OPS_LOOP_PRICE_ID=price_[your-price-id]
NEXT_PUBLIC_STRIPE_FULL_LOOP_PRICE_ID=price_[your-price-id]
```

### 8. Feature Flags

```bash
# Enable/disable features
FEATURE_AMM_ESCROW=true
FEATURE_INSURANCE=true
FEATURE_ZK_AUDIT=false
FEATURE_CROSSBORDER=false
FEATURE_SIMULATION=false

# WebAuthn settings
WEBAUTHN_REQUIRED=false
PASSTHROUGH_U2F_COMPAT=false

# AI Agent settings
AGENT_FEEDSTOCK_MATCHER_ENABLED=true
AGENT_TRACE_BOT_ENABLED=true
AGENT_ROUTE_GEN_ENABLED=true
AGENT_LIQUIDITY_BOT_ENABLED=false
AGENT_LOOP_AUDIT_BOT_ENABLED=false
AGENT_EXECUTION_MODE=STANDARD
```

### 9. DAO Governance Parameters

```bash
DAO_MIN_QUORUM=100000
DAO_VOTING_PERIOD=604800
DAO_TIMELOCK_DELAY=172800
DAO_PROPOSAL_THRESHOLD=1000
```

### 10. Security & Monitoring (Optional)

```bash
# Sentry for error tracking
SENTRY_DSN=[your-sentry-dsn]

# File upload limits
NEXT_PUBLIC_FILE_MAX_MB=25
```

## Minimal Setup for Testing

If you want to get the site running quickly with minimal features, use these environment variables:

```bash
# Required minimum
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-generated-secret-here
JWT_SECRET=your-generated-secret-here

# Placeholders to prevent errors
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
OPENROUTER_API_KEY=placeholder

# Blockchain placeholders
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_RPC_URL_POLYGON=https://polygon-rpc.com
NEXT_PUBLIC_RPC_URL_ETHEREUM=https://eth.llamarpc.com

# Feature flags (disable most features)
FEATURE_AMM_ESCROW=false
FEATURE_INSURANCE=false
WEBAUTHN_REQUIRED=false
AGENT_FEEDSTOCK_MATCHER_ENABLED=false
AGENT_TRACE_BOT_ENABLED=false
AGENT_ROUTE_GEN_ENABLED=false
```

## Deployment Process

1. Add all environment variables in Netlify dashboard
2. Trigger a new deployment:
   - Push to your connected Git branch, OR
   - Click "Trigger deploy" → "Deploy site" in Netlify dashboard
3. Monitor the build logs for any errors
4. Once deployed, test the site functionality

## Troubleshooting

### Build Errors
- If build fails due to missing env vars, check the build logs
- Ensure all `NEXT_PUBLIC_*` variables are set (they're needed at build time)
- Try the minimal setup first, then add more services

### Runtime Errors
- Check the Function logs in Netlify for API errors
- Verify Supabase credentials if auth isn't working
- Check browser console for client-side errors

### Features Not Working
- The app is designed to work with limited functionality if services aren't configured
- Auth features require Supabase
- AI features require OpenRouter API key
- Blockchain features require proper RPC URLs and contract addresses

## Next Steps

1. Start with the minimal setup
2. Add Supabase for authentication and database
3. Add OpenRouter for AI features
4. Configure Stripe for payments (if needed)
5. Deploy smart contracts and update addresses (for Web3 features)

## Support

For help with specific services:
- Supabase: https://supabase.com/docs
- OpenRouter: https://openrouter.ai/docs
- Netlify: https://docs.netlify.com
- Stripe: https://stripe.com/docs
