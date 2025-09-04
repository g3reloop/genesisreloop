import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // This will help with Netlify deployments
  },
  // Use SSR for all pages to avoid prerendering issues with Supabase
  experimental: {
    // This ensures pages are rendered at request time, not build time
    appDir: true,
  },
};

export default nextConfig;
