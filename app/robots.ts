import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',   // typo redirect — keep blocked
        ],
      },
    ],
    sitemap: 'https://pakbizbranhces.online/sitemap.xml',
    host: 'https://pakbizbranhces.online',
  }
}
