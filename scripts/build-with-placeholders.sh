#!/bin/bash

echo "🚀 Building with placeholder Supabase configuration..."
echo "⚠️  This is for build testing only - not for production!"
echo ""

# Export the placeholder environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5NDc4MDAsImV4cCI6MTk2MjUyMzgwMH0.placeholder_key_for_build"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0Njk0NzgwMCwiZXhwIjoxOTYyNTIzODAwfQ.placeholder_service_key_for_build"
export SUPABASE_JWT_SECRET="placeholder-jwt-secret"

echo "✅ Placeholder Supabase variables set"
echo ""

# Run the build
npm run build

echo ""
echo "✅ Build complete!"
echo "⚠️  Remember to set real Supabase credentials for production!"
