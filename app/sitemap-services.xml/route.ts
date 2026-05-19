import { NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const lastmod = '2026-05-19'

  // Category pages live at /categories/[slug]/ AND at /[slug]/ (catch-all)
  // Submit both canonical forms — the /categories/[slug]/ is the canonical
  const urls: { url: string; priority: string }[] = []

  CATEGORIES.forEach(cat => {
    // Primary canonical URL
    urls.push({ url: `/categories/${cat.id}/`, priority: '0.9' })
    // Top-level shortcut URL (catch-all handles this)
    urls.push({ url: `/${cat.id}/`, priority: '0.8' })
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
