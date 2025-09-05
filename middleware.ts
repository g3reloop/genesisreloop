import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers based on OWASP recommendations
const securityHeaders = {
  // Strict Transport Security - enforce HTTPS
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Prevent clickjacking attacks
  'X-Frame-Options': 'SAMEORIGIN',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy - adjust based on your needs
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://cdn.jsdelivr.net https://cdn.segment.com https://*.segment.io",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.supabase.in https://api.github.com https://fonts.googleapis.com https://fonts.gstatic.com https://api.segment.io https://*.segment.io https://cdn.segment.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'self' https://*.supabase.co",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=()'
  ].join(', ')
};

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'https://reloop.eco'
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

export function middleware(request: NextRequest) {
  // Clone the request headers
  const headers = new Headers(request.headers);
  
  // Get pathname for route-specific handling
  const pathname = request.nextUrl.pathname;
  
  // Apply security headers to all responses
  const response = NextResponse.next({
    request: {
      headers,
    },
  });
  
  // Set security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Apply CORS headers to API routes
  if (pathname.startsWith('/api/')) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
  }
  
  // Add nonce for CSP if needed (for inline scripts)
  if (pathname === '/' || pathname.startsWith('/app')) {
    // Generate nonce for this request
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    
    // Store nonce in header for use in pages
    response.headers.set('x-nonce', nonce);
    
    // Update CSP with nonce
    const csp = response.headers.get('Content-Security-Policy');
    if (csp) {
      const updatedCsp = csp.replace(
        "script-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`
      );
      response.headers.set('Content-Security-Policy', updatedCsp);
    }
  }
  
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
