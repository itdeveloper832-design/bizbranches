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
        destination: '/categories/:categorySlug',
        permanent: true,
      },
      {
        source: '/businesses/:city/:categorySlug',
        destination: '/locations/:city/:categorySlug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
