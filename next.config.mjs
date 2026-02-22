/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ptbb.punjab.gov.pk' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      // Static uploads — permanent cache
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Public static files (images, icons, manifest)
      {
        source: '/:path(.*\\.(?:ico|png|jpg|jpeg|svg|webp|woff2|woff|ttf))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Next.js static bundles
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Books API — cached briefly with stale-while-revalidate
      {
        source: '/api/books',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=600' },
        ],
      },
      // Analytics API — no cache
      {
        source: '/api/analytics/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // Sitemap — cached for a day
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      // Public pages — cache with revalidation
      {
        source: '/:path(about|contact|privacy|terms|disclaimer)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      // Security headers — all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/generate', destination: '/papers/generate', permanent: true },
      { source: '/library', destination: '/books', permanent: true },
    ];
  },
};

export default nextConfig;
