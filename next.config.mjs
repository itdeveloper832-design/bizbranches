import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Setup the development platform only when running in development mode
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  // ─── Compress responses with gzip/brotli ────────────────────────────────────
  compress: true,

  // ─── Tree-shake large icon/UI packages — eliminates unused exports ───────────
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'recharts',
      'date-fns',
    ],
  },

  images: {
    // Serve AVIF first (smallest), fall back to WebP
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching — business logos rarely change
    minimumCacheTTL: 86400, // 24 hours
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // ─── Cache-Control headers for static assets ────────────────────────────────
  async headers() {
    return [
      {
        // Immutable cache for hashed Next.js static chunks
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Long cache for public images/fonts/icons
        source: '/:path*\\.(png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // ISR pages — allow CDN caching with stale-while-revalidate
        source: '/((?!_next|api).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // ─── Enforce WWW Canonical Domain Redirection ──────────────────────────────────
      // ─── Enforce WWW Canonical Domain Redirection (1-Hop Trailing Slash Aware) ───
      {
        source: '/',
        has: [{ type: 'host', value: 'pakbizbranhces.online' }],
        destination: 'https://www.pakbizbranhces.online/',
        permanent: true,
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'pakbizbranhces.online' }],
        destination: 'https://www.pakbizbranhces.online/:path*/',
        permanent: true,
      },
      {
        source: '/add-bussiness',
        destination: 'https://www.pakbizbranhces.online/add-business/',
        permanent: true,
      },
      {
        source: '/best-restaurants',
        destination: 'https://www.pakbizbranhces.online/restaurants/',
        permanent: true,
      },
      {
        source: '/healthcare-services',
        destination: 'https://www.pakbizbranhces.online/healthcare/',
        permanent: true,
      },
      {
        source: '/top-real-estate',
        destination: 'https://www.pakbizbranhces.online/real-estate/',
        permanent: true,
      },
      // Canonical Top-Level Absolute Redirects (1-Hop)
      {
        source: '/business/:slug',
        destination: 'https://www.pakbizbranhces.online/:slug/',
        permanent: true,
      },
      {
        source: '/category/:slug',
        destination: 'https://www.pakbizbranhces.online/:slug/',
        permanent: true,
      },
      {
        source: '/categories/:slug',
        destination: 'https://www.pakbizbranhces.online/:slug/',
        permanent: true,
      },
      {
        source: '/cities/:city',
        destination: 'https://www.pakbizbranhces.online/:city/',
        permanent: true,
      },
      {
        source: '/businesses/:city/:categorySlug',
        destination: 'https://www.pakbizbranhces.online/:city/:categorySlug/',
        permanent: true,
      },
      {
        source: '/locations/:city/:categorySlug',
        destination: 'https://www.pakbizbranhces.online/:city/:categorySlug/',
        permanent: true,
      },
      {
        source: '/smarttalk',
        destination: 'https://www.pakbizbranhces.online/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
