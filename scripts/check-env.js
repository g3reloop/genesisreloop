#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment variables...\n');

// Required environment variables
const requiredVars = {
  // Supabase (CRITICAL - Build will fail without these)
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL (e.g., https://xxxxx.supabase.co)',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase anonymous/public key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key (for server-side operations)',
  
  // Database
  'DATABASE_URL': 'PostgreSQL connection string (pooled)',
  'SUPABASE_DATABASE_URL': 'Supabase database URL (same as DATABASE_URL)',
  
  // Authentication
  'NEXTAUTH_URL': 'Your production URL (e.g., https://your-app.netlify.app)',
  'NEXTAUTH_SECRET': 'Random 32-character secret for NextAuth',
  'JWT_SECRET': 'Random 32-character secret for JWT',
};

// Optional but recommended
const optionalVars = {
  'SUPABASE_JWT_SECRET': 'JWT secret from Supabase settings',
  'UPSTASH_REDIS_REST_URL': 'Redis REST URL for caching',
  'UPSTASH_REDIS_REST_TOKEN': 'Redis authentication token',
  'NODE_ENV': 'Environment (development/production)',
  'NEXT_PUBLIC_SITE_URL': 'Public site URL',
};

// Load .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Found .env.local file\n');
} else {
  console.log('❌ No .env.local file found\n');
}

// Check required variables
let hasErrors = false;
console.log('🔴 Required Environment Variables:');
console.log('═'.repeat(50));

Object.entries(requiredVars).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    console.log(`❌ ${key}`);
    console.log(`   ${description}`);
    console.log('');
    hasErrors = true;
  } else {
    console.log(`✅ ${key}`);
    // Mask the value for security
    const masked = value.substring(0, 10) + '...' + (value.length > 20 ? value.substring(value.length - 5) : '');
    console.log(`   Value: ${masked}`);
    console.log('');
  }
});

// Check optional variables
console.log('\n🟡 Optional Environment Variables:');
console.log('═'.repeat(50));

Object.entries(optionalVars).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    console.log(`⚠️  ${key}`);
    console.log(`   ${description}`);
    console.log('');
  } else {
    console.log(`✅ ${key}`);
    const masked = value.substring(0, 10) + '...' + (value.length > 20 ? value.substring(value.length - 5) : '');
    console.log(`   Value: ${masked}`);
    console.log('');
  }
});

// Summary
console.log('\n📊 Summary:');
console.log('═'.repeat(50));

if (hasErrors) {
  console.log('❌ Missing required environment variables!');
  console.log('\nTo fix this:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Fill in the missing values from your Supabase dashboard');
  console.log('3. For Netlify deployment, add these variables in the Netlify dashboard\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
  console.log('\nRemember to add these same variables to your Netlify deployment.\n');
}

// Additional checks
console.log('🔧 Additional Checks:');
console.log('═'.repeat(50));

// Check Supabase URL format
if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')) {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL might be incorrect - should contain .supabase.co');
}

// Check if keys look like placeholders
const placeholderPatterns = ['your-', 'YOUR-', 'xxx', 'placeholder', 'example'];
Object.entries(process.env).forEach(([key, value]) => {
  if (value && placeholderPatterns.some(pattern => value.includes(pattern))) {
    console.log(`⚠️  ${key} appears to contain a placeholder value`);
  }
});

console.log('\n✨ Done!');
