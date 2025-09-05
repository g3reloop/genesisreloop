# 🚨 Quick Fix for Netlify Deployment

## What I've Done
1. Added `export const dynamic = 'force-dynamic'` to both `/verify` and `/verify/status` pages to prevent build-time rendering
2. Created an environment checking script at `scripts/check-env.js`
3. Created comprehensive documentation at `NETLIFY_ENV_SETUP.md`

## What You Need to Do NOW

### 1. Add these to Netlify Environment Variables:

```bash
# From your Supabase Dashboard (Settings → API)
NEXT_PUBLIC_SUPABASE_URL=[Your Project URL - looks like https://xxxxx.supabase.co]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your anon public key]
SUPABASE_SERVICE_ROLE_KEY=[Your service_role key - click eye icon to reveal]

# Copy from your DATABASE_URL (or get from Supabase Dashboard → Settings → Database)
SUPABASE_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reloop_dev

# Generate a secure JWT secret
JWT_SECRET=[Generate using: openssl rand -base64 32]
```

### 2. How to Add to Netlify:
1. Go to your Netlify dashboard
2. Click on your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable above

### 3. Redeploy:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

## The deployment should now work! 🎉

## For Local Testing:
Add these same variables to your `.env.local` file to test locally.
