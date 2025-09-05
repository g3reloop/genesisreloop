#!/bin/bash

# Generate secure secrets for production environment variables
echo "🔐 Generating secure secrets for ReLoop Platform production deployment..."
echo ""

# Generate NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
echo ""

# Generate JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate SUPABASE_JWT_SECRET (if needed)
SUPABASE_JWT_SECRET=$(openssl rand -base64 32)
echo "SUPABASE_JWT_SECRET=$SUPABASE_JWT_SECRET"
echo ""

echo "✅ Secrets generated successfully!"
echo ""
echo "📋 Copy these values to your Netlify environment variables."
echo "⚠️  Keep these values secure and never commit them to version control!"
