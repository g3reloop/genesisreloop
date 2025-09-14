#!/bin/bash

echo "Starting build process..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not set, skipping Prisma generation..."
  # Create a dummy Prisma client to satisfy TypeScript imports
  mkdir -p node_modules/@prisma/client
  echo "export const PrismaClient = class PrismaClient {};" > node_modules/@prisma/client/index.js
  echo "export default { PrismaClient };" >> node_modules/@prisma/client/index.js
else
  echo "Running Prisma generate..."
  npx prisma generate
fi

echo "Building Next.js application..."
npx next build
