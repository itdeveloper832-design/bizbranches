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
          '/search?',         // prevent crawling search result URLs with query params
        ],
      },
      // Block AI training bots from scraping business data
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      // Explicitly allow AI search/answer citation crawlers
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',
          '/search?',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/user/',
          '/add-bussiness',
          '/search?',
        ],
      },
    ],
    sitemap: 'https://pakbizbranhces.online/sitemap.xml',
    host: 'https://pakbizbranhces.online',
  }
}
