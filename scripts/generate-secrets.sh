#!/bin/bash

# Generate secure secrets for production environment variables
echo "🔐 Generating secure secrets for ReLoop Platform production deployment..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required to generate secrets. Please install Node.js first."
    exit 1
fi

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo ""

# Generate JWT_SECRET
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate SUPABASE_JWT_SECRET (if needed)
SUPABASE_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo "SUPABASE_JWT_SECRET=$SUPABASE_JWT_SECRET"
echo ""

echo "✅ Secrets generated successfully!"
echo ""
echo "📋 Copy these values to your Netlify environment variables."
echo "⚠️  Keep these values secure and never commit them to version control!"
