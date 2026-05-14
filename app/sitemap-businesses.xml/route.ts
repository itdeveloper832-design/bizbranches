import { NextResponse } from 'next/server'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]
  const businesses = await fetchAllBusinessesForSitemap()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${businesses.map(biz => `  <url>
    <loc>${BASE_URL}/${biz.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
