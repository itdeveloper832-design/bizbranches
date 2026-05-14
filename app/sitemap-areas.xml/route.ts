import { NextResponse } from 'next/server'
import { CITIES, CATEGORIES } from '@/lib/data'

const BASE_URL = 'https://pakbizbranhces.online'

// Only include top cities in city+category combinations to keep sitemap manageable
// and avoid submitting thousands of thin pages to Google
const TOP_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Sargodha', 'Bahawalpur', 'Sahiwal',
  'Mardan', 'Sukkur', 'Larkana', 'Gwadar', 'Muzaffarabad'
]

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]

  const urls: { url: string; priority: string }[] = []

  // All city pages — canonical at /cities/[city]/
  CITIES.forEach(city => {
    const citySlug = city.toLowerCase().replace(/ /g, '-')
    urls.push({ url: `/cities/${citySlug}/`, priority: '0.8' })
    // Top-level shortcut (catch-all)
    urls.push({ url: `/${citySlug}/`, priority: '0.7' })
  })

  // City + Category combinations — only for top cities to avoid thin content
  TOP_CITIES.forEach(city => {
    const citySlug = city.toLowerCase().replace(/ /g, '-')
    CATEGORIES.forEach(cat => {
      // Canonical URL at /locations/[city]/[cat]/
      urls.push({ url: `/locations/${citySlug}/${cat.id}/`, priority: '0.7' })
    })
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
