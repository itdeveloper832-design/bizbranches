import { NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://www.pakbizbranhces.online'

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]

  // Category pages live at /[slug]/ (catch-all handles this)
  const urls: { url: string; priority: string }[] = []

  CATEGORIES.forEach(cat => {
    // Clean canonical category landing page
    urls.push({ url: `/${cat.id}/`, priority: '0.9' })
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority }) => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
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
