import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { LIVE_STATUSES } from '@/lib/category-mappings'

export const revalidate = 1800 // 30 min — most frequently updated
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const entries: string[] = []

  try {
    const snap = await getDocs(query(collection(db, 'businesses'), limit(50000)))
    snap.docs.forEach(doc => {
      const d = doc.data() as any
      const status = String(d.status ?? '').toLowerCase()
      if (!LIVE_STATUSES.has(status)) return
      if (!d.slug) return

      const lastmod = d.updatedAt
        ? new Date(d.updatedAt.toDate?.() ?? d.updatedAt).toISOString().split('T')[0]
        : d.createdAt
          ? new Date(d.createdAt.toDate?.() ?? d.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]

      entries.push(`  <url>
    <loc>${BASE_URL}/business/${d.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`)
    })
  } catch (e) {
    console.error('[sitemap/businesses]', e)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  })
}
