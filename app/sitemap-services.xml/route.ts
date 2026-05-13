import { NextResponse } from 'next'
import { CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const lastmod = '2026-05-05'

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${CATEGORIES.map(cat => `
  <url>
    <loc>${BASE_URL}/${cat.id}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
