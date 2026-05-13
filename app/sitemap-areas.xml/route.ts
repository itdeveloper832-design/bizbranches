import { NextResponse } from 'next/server'
import { CITIES, CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const lastmod = '2026-05-05'
  
  const cityUrls = CITIES.map(city => city.toLowerCase().replace(/ /g, '-'))
  const categoryUrls = CATEGORIES.map(cat => cat.id)

  const urls: string[] = []

  // City Pages
  cityUrls.forEach(city => {
    urls.push(`${BASE_URL}/${city}/`)
  })

  // City + Category Combinations
  cityUrls.forEach(city => {
    categoryUrls.forEach(cat => {
      urls.push(`${BASE_URL}/${city}/${cat}/`)
    })
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
