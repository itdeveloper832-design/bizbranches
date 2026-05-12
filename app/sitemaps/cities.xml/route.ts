import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { LIVE_STATUSES } from '@/lib/category-mappings'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const cityCounts = new Map<string, number>()

  try {
    const snap = await getDocs(query(collection(db, 'businesses'), limit(50000)))
    snap.docs.forEach(doc => {
      const d = doc.data() as any
      const status = String(d.status ?? '').toLowerCase()
      if (!LIVE_STATUSES.has(status)) return
      const citySlug = d.city?.toLowerCase().replace(/ /g, '-')
      if (citySlug) cityCounts.set(citySlug, (cityCounts.get(citySlug) ?? 0) + 1)
    })
  } catch (e) {
    console.error('[sitemap/cities]', e)
  }

  const entries = Array.from(cityCounts.entries())
    .filter(([, count]) => count >= 3)
    .map(([city]) => `  <url>
    <loc>${BASE_URL}/cities/${city}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
