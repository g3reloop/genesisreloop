# ReLoop Platform - Production Setup Guide

## Phase 1 Completion Checklist ✅

### 1. Environment & Security Setup ✅
- [x] Created comprehensive `.env.example` with all required variables
- [x] Implemented security middleware with OWASP-compliant headers
- [x] Configured CORS policies for API routes
- [x] Set up environment configuration helper (`lib/config/env.ts`)
- [x] Enhanced Netlify configuration for production deployment
- [x] Added CSP (Content Security Policy) headers
- [x] Configured security headers (HSTS, X-Frame-Options, etc.)

### 2. Database Production Setup ✅
- [x] Configured Supabase database connections
- [x] Set up connection pooling with PgBouncer
- [x] Added database indexes for performance
- [x] Created database setup and migration scripts
- [x] Implemented Supabase client for browser and server
- [x] Added admin client configuration for service operations
- [x] Updated Prisma schema with directUrl for migrations

### 3. Redis & Caching Infrastructure ✅
- [x] Set up Upstash Redis client
- [x] Implemented rate limiting (API, auth, heavy operations)
- [x] Created caching utilities and middleware
- [x] Built session management system
- [x] Added queue management for background jobs
- [x] Implemented cache invalidation by tags
- [x] Created rate limiting middleware with headers

## 🚀 Quick Start Guide

### Prerequisites
1. Create a Supabase project at https://supabase.com
2. Create an Upstash Redis database at https://upstash.com
3. Set up a Netlify account at https://netlify.com

### Step 1: Set Up Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   - Go to your Supabase project settings
   - Copy the Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the service_role key → `SUPABASE_SERVICE_ROLE_KEY`
   - Get the database URL from Settings > Database

3. Fill in your Upstash Redis credentials:
   - Go to your Upstash console
   - Copy the REST URL → `UPSTASH_REDIS_REST_URL`
   - Copy the REST Token → `UPSTASH_REDIS_REST_TOKEN`

4. Generate secure secrets:
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # Generate JWT_SECRET
   openssl rand -base64 32
   
   # Generate ENCRYPTION_KEY (32 characters)
   openssl rand -hex 16
   ```

### Step 2: Initialize Database

1. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

2. Push schema to Supabase:
   ```bash
   npx prisma db push
   ```

3. (Optional) Run the setup script:
   ```bash
   npx tsx scripts/db-setup.ts
   ```

### Step 3: Set Up Supabase Security

1. **Enable Row Level Security (RLS)**:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Supplier" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Processor" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Buyer" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Collector" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "FeedstockBatch" ENABLE ROW LEVEL SECURITY;
   -- ... (enable for all tables)
   ```

2. **Create RLS Policies** (example for User table):
   ```sql
   -- Users can read their own data
   CREATE POLICY "Users can read own data" ON "User"
   FOR SELECT USING (auth.uid() = id);
   
   -- Users can update their own data
   CREATE POLICY "Users can update own data" ON "User"
   FOR UPDATE USING (auth.uid() = id);
   ```

### Step 4: Deploy to Netlify

1. **Connect GitHub Repository**:
   - Log in to Netlify
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 (already set in netlify.toml)

3. **Set Environment Variables**:
   - Go to Site settings > Environment variables
   - Add all variables from `.env.local`
   - Set `NODE_ENV=production`
   - Set production URLs for `NEXT_PUBLIC_APP_URL`

4. **Deploy**:
   - Trigger a deploy from the Netlify dashboard
   - Monitor the build logs

### Step 5: Post-Deployment Setup

1. **Configure Supabase Auth**:
   - Add your Netlify URL to allowed redirects
   - Configure email templates
   - Set up OAuth providers if needed

2. **Set Up Monitoring**:
   - Configure Sentry for error tracking
   - Set up Upstash Redis monitoring
   - Enable Supabase database insights

3. **Security Hardening**:
   - Review and adjust CSP headers in middleware
   - Configure WAF rules in Cloudflare (if using)
   - Set up DDoS protection

## 📋 Environment Variables Reference

### Required for Production
- `DATABASE_URL` - Supabase pooled connection string
- `DIRECT_URL` - Supabase direct connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `REDIS_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_URL` - Upstash REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash REST token
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `ENCRYPTION_KEY` - 32-character encryption key

### Optional but Recommended
- `SENTRY_DSN` - For error tracking
- `SNYK_TOKEN` - For security scanning
- Email configuration for authentication
- Blockchain RPC endpoints
- Payment gateway credentials

## 🔒 Security Best Practices

1. **Never commit `.env.local` or production secrets**
2. **Use environment-specific configurations**
3. **Enable 2FA on all service accounts**
4. **Regularly rotate API keys and secrets**
5. **Monitor rate limiting and adjust as needed**
6. **Keep dependencies updated**
7. **Use Netlify's environment variables for production**

## 🆘 Troubleshooting

### Database Connection Issues
- Verify Supabase project is active
- Check connection string format
- Ensure PgBouncer is enabled for pooled connections

### Redis Connection Issues
- Verify Upstash credentials
- Check if Redis database is active
- Ensure REST API is enabled

### Build Failures on Netlify
- Check Node version matches local (18)
- Verify all environment variables are set
- Check build logs for specific errors

### Rate Limiting Issues
- Adjust rate limits in `lib/redis/client.ts`
- Monitor usage patterns
- Consider different limits for different endpoints

## 📞 Next Steps

1. **Phase 2**: Implement authentication and authorization
2. **Phase 3**: Set up error handling and monitoring
3. **Phase 4**: Configure CI/CD pipeline
4. **Phase 5**: Optimize performance and implement testing

For questions or issues, check the [README](../README.md) or open an issue on GitHub.
