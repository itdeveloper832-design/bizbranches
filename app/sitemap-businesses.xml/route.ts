import { NextResponse } from 'next/server'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'

const BASE_URL = 'https://www.pakbizbranhces.online'

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]
  const businesses = await fetchAllBusinessesForSitemap()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${businesses.map(biz => {
  const imageXml = biz.logoUrl ? `\n    <image:image>
      <image:loc>${biz.logoUrl}</image:loc>
      <image:title>${biz.slug.replace(/-/g, ' ')}</image:title>
    </image:image>` : ''
  return `  <url>
    <loc>${BASE_URL}/${biz.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>${imageXml}
  </url>`
}).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}

export const runtime = 'edge';
