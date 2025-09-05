# Netlify Environment Variables Setup Guide

## Issue
The Netlify deployment is failing because the required Supabase environment variables are not configured. The error specifically mentions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Required Environment Variables

You need to add the following environment variables to your Netlify deployment:

### 1. Supabase Configuration (REQUIRED)
```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

### 2. Database URLs (REQUIRED)
```
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 3. Authentication (REQUIRED)
```
NEXTAUTH_URL=https://your-netlify-app.netlify.app
NEXTAUTH_SECRET=generate-a-32-character-secret
JWT_SECRET=generate-another-32-character-secret
```

### 4. Other Important Variables
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-netlify-app.netlify.app
```

## How to Add Environment Variables to Netlify

### Option 1: Through Netlify Dashboard (Recommended)
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Click "Add a variable"
5. Add each variable with its key and value
6. Save and redeploy

### Option 2: Through Netlify CLI
```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-supabase-url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
# ... repeat for other variables
```

### Option 3: Through netlify.toml (NOT RECOMMENDED for secrets)
Only use this for non-sensitive variables:
```toml
[build.environment]
  NODE_ENV = "production"
  # DO NOT put secrets here as this file is committed to git
```

## Getting Your Supabase Credentials

1. Log into your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to "Settings" → "API"
4. You'll find:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys**:
     - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY`
5. For the database URL, go to "Settings" → "Database" and copy the connection string

## Generating Secrets

To generate secure secrets for NEXTAUTH_SECRET and JWT_SECRET, run:
```bash
openssl rand -base64 32
```

## Important Notes

1. **Never commit these values to git** - Always use environment variables
2. **The NEXT_PUBLIC_ prefix** means these variables are exposed to the browser, so only use it for non-sensitive data
3. **After adding variables**, you need to trigger a new deployment for them to take effect
4. **For local development**, keep using your `.env.local` file

## Verification

After setting up the environment variables and redeploying:
1. The build should complete successfully
2. The `/verify` page should load without errors
3. Authentication should work properly

## Troubleshooting

If you continue to see errors:
1. Double-check that all variable names are spelled correctly
2. Ensure there are no extra spaces or quotes in the values
3. Check the Netlify build logs for any other missing variables
4. Verify that your Supabase project is active and accessible
