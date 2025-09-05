#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Variables Diagnostic Tool\n');
console.log('=' .repeat(60));

// Function to parse .env files
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        env[key.trim()] = value;
      }
    }
  });
  
  return env;
}

// Check all .env files
const envFiles = ['.env', '.env.local', '.env.example'];
const parsedEnvs = {};

console.log('\n📁 Found Environment Files:');
console.log('-'.repeat(60));

envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const env = parseEnvFile(filePath);
  if (env) {
    parsedEnvs[file] = env;
    console.log(`✅ ${file} - ${Object.keys(env).length} variables`);
  } else {
    console.log(`❌ ${file} - Not found`);
  }
});

// Critical Supabase variables needed
const criticalVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'SUPABASE_DATABASE_URL'
];

console.log('\n🔑 Critical Supabase Variables Check:');
console.log('-'.repeat(60));

// Check each file for critical variables
Object.entries(parsedEnvs).forEach(([fileName, env]) => {
  console.log(`\n${fileName}:`);
  criticalVars.forEach(varName => {
    if (env[varName]) {
      const value = env[varName];
      // Check if it's a placeholder
      const isPlaceholder = value.includes('YOUR-') || 
                           value.includes('your-') || 
                           value.includes('xxx') || 
                           value.includes('[') ||
                           value === '';
      
      if (isPlaceholder) {
        console.log(`  ⚠️  ${varName} = PLACEHOLDER VALUE`);
      } else {
        // Mask the actual value
        const masked = value.substring(0, 15) + '...';
        console.log(`  ✅ ${varName} = ${masked}`);
      }
    } else {
      console.log(`  ❌ ${varName} = NOT SET`);
    }
  });
});

// Check for alternative variable names
console.log('\n🔄 Alternative Variable Names Check:');
console.log('-'.repeat(60));

const alternatives = {
  'SUPABASE_URL': 'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_ANON_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_PUBLIC_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'REACT_APP_SUPABASE_URL': 'NEXT_PUBLIC_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_URL': 'NEXT_PUBLIC_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY': 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
};

Object.entries(parsedEnvs).forEach(([fileName, env]) => {
  const foundAlts = [];
  Object.entries(alternatives).forEach(([alt, correct]) => {
    if (env[alt] && !env[correct]) {
      foundAlts.push(`${alt} → should be ${correct}`);
    }
  });
  
  if (foundAlts.length > 0) {
    console.log(`\n${fileName} has alternative variable names:`);
    foundAlts.forEach(alt => console.log(`  ⚠️  ${alt}`));
  }
});

// Check which file is being used
console.log('\n📊 Environment Priority (Next.js loads in this order):');
console.log('-'.repeat(60));
console.log('1. .env.local (if exists) - Local overrides');
console.log('2. .env (if exists) - Default values');
console.log('3. .env.example - Template only, not loaded');

// Recommendations
console.log('\n💡 Recommendations:');
console.log('-'.repeat(60));

const hasLocalFile = parsedEnvs['.env.local'];
const hasEnvFile = parsedEnvs['.env'];

if (hasLocalFile) {
  const localVars = parsedEnvs['.env.local'];
  const missingInLocal = criticalVars.filter(v => !localVars[v] || 
    localVars[v].includes('YOUR-') || 
    localVars[v].includes('['));
  
  if (missingInLocal.length > 0) {
    console.log('\n⚠️  Your .env.local is missing or has placeholder values for:');
    missingInLocal.forEach(v => console.log(`   - ${v}`));
    console.log('\n   These MUST be set in Netlify environment variables!');
  }
}

if (!hasLocalFile && hasEnvFile) {
  console.log('\n⚠️  You\'re using .env file directly. Consider using .env.local for local development.');
}

console.log('\n🚀 For Netlify Deployment:');
console.log('   Make sure ALL these variables are set in Netlify dashboard:');
criticalVars.forEach(v => console.log(`   - ${v}`));

console.log('\n✨ Done!\n');
