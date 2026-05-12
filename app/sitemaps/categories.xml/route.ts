import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { LIVE_STATUSES } from '@/lib/category-mappings'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const categoryCounts = new Map<string, number>()

  try {
    const snap = await getDocs(query(collection(db, 'businesses'), limit(50000)))
    snap.docs.forEach(doc => {
      const d = doc.data() as any
      const status = String(d.status ?? '').toLowerCase()
      if (!LIVE_STATUSES.has(status)) return
      const cat = d.category
      if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1)
    })
  } catch (e) {
    console.error('[sitemap/categories]', e)
  }

  const entries = Array.from(categoryCounts.entries())
    .filter(([, count]) => count >= 3)
    .map(([cat]) => `  <url>
    <loc>${BASE_URL}/categories/${cat}/</loc>
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
