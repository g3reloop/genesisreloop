# ReLoop Platform - Deployment Checklist

## Pre-Deployment Checklist

### 1. Supabase Setup ✅

- [ ] Create Supabase project
- [ ] Copy project URL and keys to `.env.local`
- [ ] Enable Email Auth in Authentication settings
- [ ] Configure allowed redirect URLs:
  ```
  http://localhost:3000/**
  https://your-netlify-domain.netlify.app/**
  https://reloop.eco/**
  ```

### 2. Database Setup ✅

- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Execute SQL migrations in Supabase SQL Editor:
  1. `supabase/migrations/001_initial_setup.sql`
  2. `supabase/migrations/002_rls_policies.sql`
  3. `supabase/migrations/003_triggers.sql`
- [ ] Verify tables are created with RLS enabled
- [ ] Test RLS policies with different user roles

### 3. Upstash Redis Setup ✅

- [ ] Create Upstash Redis database
- [ ] Copy REST URL and token to `.env.local`
- [ ] Enable eviction policy (recommended: `allkeys-lru`)
- [ ] Set max memory limit based on your plan

### 4. Environment Variables ✅

Required for production:
- [ ] `DATABASE_URL` - Supabase connection string (pooled)
- [ ] `DIRECT_URL` - Supabase direct connection
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `NEXTAUTH_URL` - Your production URL
- [ ] `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `JWT_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `ENCRYPTION_KEY` - Generate with `openssl rand -hex 16`

### 5. Netlify Configuration ✅

- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `.next`
- [ ] Add all environment variables from `.env.local`
- [ ] Enable automatic deploys from main branch

### 6. Security Configuration ✅

- [ ] Review middleware security headers
- [ ] Update CORS allowed origins for production
- [ ] Configure rate limiting thresholds
- [ ] Set up Web Application Firewall (if using Cloudflare)

## Deployment Steps

### Step 1: Prepare for Deployment

```bash
# Run initialization script
./scripts/init-platform.sh

# Verify build succeeds
npm run build

# Test production build locally
npm start
```

### Step 2: Deploy to Netlify

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in project
netlify init

# Deploy to production
netlify deploy --prod
```

### Step 3: Post-Deployment Tasks

- [ ] Test health endpoint: `https://your-domain.netlify.app/.netlify/functions/health`
- [ ] Verify database connectivity
- [ ] Test Redis caching
- [ ] Check rate limiting is working
- [ ] Verify webhook endpoint if using

### Step 4: Monitoring Setup

- [ ] Set up Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Set up performance monitoring
- [ ] Create alerts for:
  - Database connection failures
  - High error rates
  - Rate limit breaches
  - Low Redis memory

## Production Environment Variables

Add these in Netlify Dashboard → Site settings → Environment variables:

```env
# Core Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://reloop.eco
NEXT_PUBLIC_API_URL=https://reloop.eco/api
NEXT_PUBLIC_WS_URL=wss://reloop.eco

# Database (from Supabase)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-key]
SUPABASE_JWT_SECRET=[your-jwt-secret]

# Redis (from Upstash)
UPSTASH_REDIS_REST_URL=https://[endpoint].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-token]

# Security
NEXTAUTH_URL=https://reloop.eco
NEXTAUTH_SECRET=[generate-new]
JWT_SECRET=[generate-new]
ENCRYPTION_KEY=[generate-new]

# Optional Services
SENTRY_DSN=[if-using-sentry]
SNYK_TOKEN=[if-using-snyk]
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check all environment variables are set
   - Ensure Node version is 18+
   - Clear cache: `netlify build --clear-cache`

2. **Database Connection Issues**
   - Verify Supabase project is not paused
   - Check connection string format
   - Ensure IP is not blocked

3. **Redis Errors**
   - Check Upstash quota limits
   - Verify REST token is correct
   - Monitor memory usage

4. **Function Timeouts**
   - Netlify Functions have 10s default timeout
   - Optimize database queries
   - Use background functions for long tasks

## Rollback Procedure

If issues occur after deployment:

1. **Immediate Rollback**
   ```bash
   netlify rollback
   ```

2. **Database Rollback**
   - Use Supabase dashboard → Database → Backups
   - Restore to previous point in time

3. **Cache Clear**
   - Clear Redis cache
   - Invalidate CDN if using

## Security Checklist

- [ ] All secrets rotated from development
- [ ] RLS policies tested and verified
- [ ] API endpoints have rate limiting
- [ ] Webhook signatures configured
- [ ] HTTPS enforced everywhere
- [ ] Security headers verified

## Performance Checklist

- [ ] Images optimized and using Next.js Image
- [ ] Database queries have proper indexes
- [ ] Caching strategy implemented
- [ ] Bundle size under 250KB (First Load JS)
- [ ] Core Web Vitals passing

## Launch Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Email sending verified
- [ ] Monitoring alerts configured
- [ ] Backup strategy documented
- [ ] Support contact updated
- [ ] Terms of Service and Privacy Policy linked

## Post-Launch Monitoring (First 48 Hours)

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user registrations
- [ ] Verify payment processing
- [ ] Check email deliverability
- [ ] Monitor database performance
- [ ] Review security logs

---

**Remember**: Always test in a staging environment first. Keep this checklist updated as the platform evolves.
