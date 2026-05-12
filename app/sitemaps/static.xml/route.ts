import { NextResponse } from 'next/server'

export const revalidate = 86400 // 24h
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

const STATIC_URLS = [
  { loc: `${BASE_URL}/`,                  changefreq: 'daily',   priority: '1.0' },
  { loc: `${BASE_URL}/categories/`,       changefreq: 'daily',   priority: '0.9' },
  { loc: `${BASE_URL}/cities/`,           changefreq: 'daily',   priority: '0.9' },
  { loc: `${BASE_URL}/add-business/`,     changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE_URL}/featured-businesses/`, changefreq: 'daily', priority: '0.7' },
  { loc: `${BASE_URL}/blog/`,             changefreq: 'weekly',  priority: '0.7' },
  { loc: `${BASE_URL}/about/`,            changefreq: 'monthly', priority: '0.5' },
  { loc: `${BASE_URL}/contact/`,          changefreq: 'monthly', priority: '0.5' },
  { loc: `${BASE_URL}/privacy/`,          changefreq: 'yearly',  priority: '0.3' },
  { loc: `${BASE_URL}/terms/`,            changefreq: 'yearly',  priority: '0.3' },
]

function buildXml(urls: typeof STATIC_URLS): string {
  const today = new Date().toISOString().split('T')[0]
  const entries = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}

export async function GET() {
  return new NextResponse(buildXml(STATIC_URLS), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}
