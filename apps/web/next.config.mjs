import withBundleAnalyzer from '@next/bundle-analyzer'

const withBA = withBundleAnalyzer({ 
  enabled: process.env.ANALYZE === 'true' 
})

export default withBA({ 
  reactStrictMode: true, 
  experimental: { 
    serverActions: true 
  }, 
  images: { 
    domains: ['mux.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5173'
  }
})
