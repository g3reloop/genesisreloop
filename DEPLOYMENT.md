# ReLoop Platform Deployment Guide

## Netlify Deployment

### Required Environment Variables

Before deploying to Netlify, you must set the following environment variables in your Netlify dashboard:

1. Go to your Netlify project settings
2. Navigate to "Site configuration" > "Environment variables"
3. Add the following variables:

#### Required Variables

```bash
# Supabase Configuration (Get from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
DATABASE_URL=your-supabase-database-url

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.netlify.app
NEXTAUTH_SECRET=generate-a-secure-random-string
```

#### Optional Variables (for production)

```bash
# Redis Configuration (if using caching)
REDIS_URL=your-redis-url
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token

# Security
ENCRYPTION_KEY=your-encryption-key
```

### Getting Supabase Credentials

1. Log in to your [Supabase dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to Settings > Database
6. Copy the connection string → `DATABASE_URL`

### Generating NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set all required environment variables
4. Deploy!

### Troubleshooting

- **Node.js version error**: The platform requires Node.js 20+. This is configured in `netlify.toml`
- **Build failures**: Check that all environment variables are set correctly
- **Database connection issues**: Ensure your Supabase project is active and the DATABASE_URL is correct
