import { NextResponse } from 'next/server'

const BASE_URL = 'https://pakbizbranches.online'

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '/privacy/', priority: '0.4' },
    { url: '/terms/', priority: '0.4' },
    { url: '/about/', priority: '0.7' },
    { url: '/contact/', priority: '0.7' },
    { url: '/add-business/', priority: '0.9' },
    { url: '/featured-businesses/', priority: '0.8' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(({ url, priority }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
