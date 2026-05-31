import { NextResponse } from 'next/server'

const BASE_URL = 'https://pakbizbranches.online'

export async function GET() {
  // Dynamic lastmod — always today's date so Google sees fresh content
  const lastmod = '2026-05-19'

  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/categories/', priority: '0.9', changefreq: 'weekly' },
    { url: '/cities/', priority: '0.9', changefreq: 'weekly' },
    { url: '/add-business/', priority: '0.9', changefreq: 'monthly' },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.7', changefreq: 'monthly' },
    { url: '/featured-businesses/', priority: '0.8', changefreq: 'daily' },
    { url: '/html-sitemap/', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy/', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms/', priority: '0.4', changefreq: 'yearly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
