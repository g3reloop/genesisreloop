#!/usr/bin/env node
/**
 * Database setup and migration script for production
 * Run this after setting up your Supabase project
 */

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

// Validate environment variables
function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set these in your .env.local file');
    process.exit(1);
  }
}

// Run Prisma migrations
async function runMigrations() {
  try {
    console.log('📦 Running database migrations...');
    
    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database (for development)
    if (process.env.NODE_ENV !== 'production') {
      execSync('npx prisma db push', { stdio: 'inherit' });
    } else {
      // Use migrations in production
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    }
    
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Create database backup configuration
async function setupBackups() {
  console.log(`
📋 Database Backup Configuration for Supabase:

1. Automatic Backups (Point-in-time Recovery):
   - Supabase automatically backs up your database
   - Available on Pro plan and above
   - 7-day retention (Pro) or 30-day (Team/Enterprise)

2. Manual Backup Script:
   pg_dump "${process.env.DATABASE_URL}" > backup_$(date +%Y%m%d_%H%M%S).sql

3. Scheduled Backups (add to cron):
   0 2 * * * pg_dump "${process.env.DATABASE_URL}" | gzip > /backups/reloop_$(date +\\%Y\\%m\\%d).sql.gz

4. Restore Command:
   psql "${process.env.DATABASE_URL}" < backup.sql

5. Supabase Dashboard:
   - Go to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}
   - Navigate to Settings > Database > Backups
  `);
}

// Setup connection pooling advice
function setupPooling() {
  console.log(`
🔄 Connection Pooling Configuration:

1. Prisma is configured to use PgBouncer (built into Supabase)
2. Connection string uses port 6543 for pooled connections
3. Direct connection (port 5432) available for migrations

Current Configuration:
- Pooled URL: ${process.env.DATABASE_URL?.replace(/:[^@]+@/, ':****@')}
- Direct URL: ${process.env.DIRECT_URL?.replace(/:[^@]+@/, ':****@')}

Pool Settings (configured in Supabase dashboard):
- Pool Mode: Transaction
- Default Pool Size: 25
- Max Client Connections: 100
  `);
}

// Create indexes for performance
async function createIndexes() {
  console.log(`
📈 Recommended Database Indexes:

Add these to your schema.prisma file for better performance:

@@index([createdAt])
@@index([updatedAt])
@@index([status])
@@index([supplierId, createdAt])
@@index([processorId, createdAt])
@@index([batchCode])
@@index([email])
  `);
}

// Main setup function
async function main() {
  console.log('🚀 ReLoop Database Setup\n');
  
  validateEnv();
  await runMigrations();
  await setupBackups();
  setupPooling();
  await createIndexes();
  
  console.log('\n✅ Database setup completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Verify migrations in Supabase dashboard');
  console.log('2. Enable Row Level Security (RLS) policies');
  console.log('3. Set up database monitoring alerts');
  console.log('4. Configure backup retention policy');
}

// Run the setup
main().catch(console.error);
