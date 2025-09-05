# 🔐 Environment Variables Setup Guide

## 📋 Summary

This project uses Supabase for authentication and database operations, but the environment files in the repository don't include Supabase credentials. This is causing Netlify deployment failures.

## 🚨 Current Issues

1. **Missing Supabase Variables**: The `.env.local` file doesn't contain:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Build Failures**: Without these variables, the build fails with:
   ```
   Error: either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!
   ```

## 🛠️ Solutions

### Option 1: Set Up Real Supabase (Recommended)
1. Create a free Supabase project at https://app.supabase.com
2. Get your credentials from Settings → API
3. Add to your `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
   SUPABASE_JWT_SECRET=[your-jwt-secret]
   SUPABASE_DATABASE_URL=[your-database-url]
   ```

### Option 2: Use Placeholder Values (For Testing Only)
Run the build with placeholder values:
```bash
./scripts/build-with-placeholders.sh
```

Or manually set before building:
```bash
export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5NDc4MDAsImV4cCI6MTk2MjUyMzgwMH0.placeholder_key_for_build"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0Njk0NzgwMCwiZXhwIjoxOTYyNTIzODAwfQ.placeholder_service_key_for_build"
npm run build
```

## 📦 For Netlify Deployment

### Required Variables
Add ALL of these to Netlify's environment variables:

```bash
# Supabase (get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
SUPABASE_DATABASE_URL=

# Database (already in .env.local)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reloop_dev

# Auth (already in .env.local)
NEXTAUTH_URL=https://[your-app].netlify.app
NEXTAUTH_SECRET=development-secret-change-in-production
JWT_SECRET=development-jwt-secret

# Optional but recommended
NODE_ENV=production
```

### Steps:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add each variable with its value
3. Trigger a new deploy

## 🔍 Debugging

### Check Missing Variables
```bash
node scripts/check-env.js
```

### Diagnose Environment Setup
```bash
node scripts/diagnose-env.js
```

### Test Build Locally
```bash
# With real Supabase credentials in .env.local
npm run build

# Or with placeholders
./scripts/build-with-placeholders.sh
```

## 📝 Notes

- The app is configured to use Supabase for authentication (`@supabase/auth-helpers-nextjs`)
- Pages are marked with `export const dynamic = 'force-dynamic'` to avoid static generation issues
- The Supabase client libraries require these environment variables at build time
- Placeholder values will allow the build to succeed but the app won't function properly

## 🆘 Still Having Issues?

1. Make sure variable names match EXACTLY (they're case-sensitive)
2. Check that values don't have extra quotes or spaces
3. Ensure Supabase project is active (not paused)
4. Try clearing Netlify build cache
5. Check Netlify build logs for the exact error
