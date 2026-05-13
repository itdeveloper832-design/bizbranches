/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
  async redirects() {
    return [
      {
        source: '/add-bussiness',
        destination: '/add-business',
        permanent: true,
      },
      {
        source: '/category/:categorySlug',
        destination: '/:categorySlug',
        permanent: true,
      },
      {
        source: '/best-restaurants',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/healthcare-services',
        destination: '/hospitals',
        permanent: true,
      },
      {
        source: '/top-real-estate',
        destination: '/real-estate',
        permanent: true,
      },
      {
        source: '/smarttalk',
        destination: '/',
        permanent: true,
      },
      {
        source: '/cities/:city',
        destination: '/:city',
        permanent: true,
      },
      {
        source: '/businesses/:city/:categorySlug',
        destination: '/:city/:categorySlug',
        permanent: true,
      },
      {
        source: '/locations/:city/:categorySlug',
        destination: '/:city/:categorySlug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
