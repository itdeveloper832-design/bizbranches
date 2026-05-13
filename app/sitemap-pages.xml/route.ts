import { NextResponse } from 'next/server'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const lastmod = '2026-05-05'
  const pages = [
    '',
    '/categories/',
    '/add-business/',
    '/blog/',
    '/about/',
    '/contact/',
    '/developer/',
    '/html-sitemap/',
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
