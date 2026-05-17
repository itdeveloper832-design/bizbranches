import { NextResponse } from 'next/server'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  // Dynamic lastmod — always current date for freshness signals
  const lastmod = '2026-05-17'

  const sitemaps = [
    { loc: `${BASE_URL}/sitemap-pages.xml`, priority: 'high' },
    { loc: `${BASE_URL}/sitemap-services.xml`, priority: 'high' },
    { loc: `${BASE_URL}/sitemap-areas.xml`, priority: 'high' },
    { loc: `${BASE_URL}/sitemap-blog.xml`, priority: 'medium' },
    { loc: `${BASE_URL}/sitemap-static.xml`, priority: 'low' },
    { loc: `${BASE_URL}/sitemap-businesses.xml`, priority: 'high' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
