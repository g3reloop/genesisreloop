# ReLoop Platform Web App - Production Deployment Guide

## Prerequisites

- Netlify account with a team/project created
- Supabase project for production
- Domain name (optional, can use Netlify subdomain)
- GitHub/GitLab repository connected to Netlify

## Environment Variables for Production

Based on the codebase analysis, you need to set the following environment variables in Netlify:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Get from: Supabase Dashboard > Settings > API

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Get from: Supabase Dashboard > Settings > API

3. **SUPABASE_SERVICE_ROLE_KEY** (for server-side operations)
   - Your Supabase service role key (keep this secret!)
   - Get from: Supabase Dashboard > Settings > API
   - ⚠️ Never expose this in client-side code

### Optional Environment Variables (based on features used)

4. **NEXT_PUBLIC_APP_URL**
   - Your production URL
   - Example: `https://reloop.yourdomain.com`
   - Default: Will use Netlify URL if not set

5. **DATABASE_URL** (if using direct database connections)
   - PostgreSQL connection string
   - Get from: Supabase Dashboard > Settings > Database

6. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** (if using Stripe)
   - Your Stripe publishable key

7. **STRIPE_SECRET_KEY** (if using Stripe)
   - Your Stripe secret key

8. **NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN** (if using maps)
   - Your Mapbox access token

9. **RESEND_API_KEY** (if using Resend for emails)
   - Your Resend API key

10. **ALGOLIA_APP_ID** & **ALGOLIA_API_KEY** (if using Algolia search)
    - Your Algolia credentials

## Setting Environment Variables in Netlify

### Method 1: Netlify UI

1. Go to your Netlify site dashboard
2. Navigate to **Site Configuration** > **Environment variables**
3. Click **Add a variable**
4. For each variable:
   - Key: Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: Enter the corresponding value
   - Scopes: Select "All scopes" for production
5. Click **Save**

### Method 2: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your local project to Netlify site
netlify link

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-supabase-url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your-service-key"
# ... add other variables
```

### Method 3: Using netlify.toml (NOT recommended for secrets)

You can set non-sensitive variables in netlify.toml:

```toml
[build.environment]
  NEXT_PUBLIC_APP_URL = "https://reloop.yourdomain.com"
  NODE_VERSION = "20"
```

## Deployment Steps

### Initial Setup

1. **Connect Repository to Netlify**
   - In Netlify Dashboard, click "Add new site" > "Import an existing project"
   - Choose your Git provider and repository
   - Select the branch to deploy (usually `main` or `production`)

2. **Configure Build Settings**
   - Base directory: `apps/web`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - These are already configured in `netlify.toml`

3. **Set Environment Variables**
   - Add all required environment variables as described above

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

### Continuous Deployment

- Netlify automatically deploys when you push to the connected branch
- Preview deployments are created for pull requests

## Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test Supabase connection (auth, database queries)
- [ ] Check that all API routes are working
- [ ] Verify static assets are loading (images, fonts)
- [ ] Test form submissions and API integrations
- [ ] Check SEO meta tags and social sharing
- [ ] Verify analytics/monitoring is working
- [ ] Test on multiple devices and browsers

## Production Optimizations

### Headers (already in netlify.toml)
- Security headers are configured
- Cache headers for static assets
- CORS headers if needed

### Performance
- Next.js automatic code splitting is enabled
- Image optimization with Next.js Image component
- Static pages are pre-rendered at build time

### Monitoring
- Use Netlify Analytics (paid feature)
- Set up error tracking (e.g., Sentry)
- Monitor Core Web Vitals

## Troubleshooting

### Build Failures
1. Check build logs in Netlify dashboard
2. Verify all dependencies are in package.json
3. Ensure environment variables are set
4. Check Node.js version compatibility

### Runtime Errors
1. Check Netlify function logs
2. Verify API routes are working
3. Check browser console for client-side errors
4. Ensure Supabase project is accessible

### Common Issues
- **500 errors**: Usually missing environment variables
- **404 on routes**: Check Next.js routing configuration
- **CORS errors**: Update Supabase or API CORS settings
- **Build timeout**: Optimize build or increase timeout

## Rollback Procedure

If issues occur after deployment:

1. Go to Netlify Dashboard > Deploys
2. Find the last working deployment
3. Click "Publish deploy" on that deployment
4. Investigate and fix the issue
5. Deploy the fix

## Maintenance

- Regularly update dependencies
- Monitor security advisories
- Review and rotate API keys periodically
- Keep Supabase and other services updated

## Support

- Netlify Support: https://answers.netlify.com/
- Supabase Support: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
