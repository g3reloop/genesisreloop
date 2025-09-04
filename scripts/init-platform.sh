#!/bin/bash
# ReLoop Platform Initialization Script

echo "🚀 ReLoop Platform Initialization"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo "Please copy .env.example to .env.local and fill in your credentials"
    exit 1
fi

echo -e "${GREEN}✓ Environment file found${NC}"

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# 1. Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
npm install

# 2. Generate Prisma Client
echo -e "\n${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# 3. Push database schema to Supabase
echo -e "\n${YELLOW}🗄️  Setting up database schema...${NC}"
npx prisma db push

# 4. Run SQL migrations
echo -e "\n${YELLOW}🚀 Running Supabase migrations...${NC}"
echo "Please run the following SQL files in your Supabase SQL editor:"
echo "1. supabase/migrations/001_initial_setup.sql"
echo "2. supabase/migrations/002_rls_policies.sql"
echo "3. supabase/migrations/003_triggers.sql"

# 5. Deploy Supabase Edge Functions
echo -e "\n${YELLOW}🌐 Deploy Edge Functions:${NC}"
echo "Run: npx supabase functions deploy feedstock-matcher"

# 6. Test connections
echo -e "\n${YELLOW}🧪 Testing connections...${NC}"
node -e "
const { createClient } = require('@supabase/supabase-js');
const { Redis } = require('@upstash/redis');

async function test() {
  try {
    // Test Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { error } = await supabase.from('User').select('count').limit(1).single();
    if (!error) console.log('✓ Supabase connection successful');
    else console.error('✗ Supabase error:', error.message);

    // Test Redis
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    await redis.ping();
    console.log('✓ Redis connection successful');
  } catch (e) {
    console.error('✗ Connection error:', e.message);
  }
}
test();
"

# 7. Build the project
echo -e "\n${YELLOW}🏗️  Building the project...${NC}"
npm run build

echo -e "\n${GREEN}✅ Platform initialization complete!${NC}"
echo -e "\nNext steps:"
echo "1. Run the SQL migrations in Supabase"
echo "2. Deploy Edge Functions if using them"
echo "3. Configure Netlify environment variables"
echo "4. Deploy to Netlify"
echo -e "\nTo start development server: ${YELLOW}npm run dev${NC}"
