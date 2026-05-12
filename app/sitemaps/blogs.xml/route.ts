import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  const entries: string[] = []

  try {
    const snap = await getDocs(
      query(collection(db, 'blogPosts'), orderBy('date', 'desc'), limit(200))
    )
    snap.docs.forEach(doc => {
      const d = doc.data() as any
      if (d.hidden) return
      const lastmod = d.updatedAt
        ? new Date(d.updatedAt.toDate?.() ?? d.updatedAt).toISOString().split('T')[0]
        : new Date(d.date || Date.now()).toISOString().split('T')[0]
      entries.push(`  <url>
    <loc>${BASE_URL}/blog/${doc.id}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`)
    })
  } catch {
    try {
      const { BLOG_POSTS } = await import('@/lib/blog-data')
      BLOG_POSTS.filter(p => !p.hidden).forEach(p => {
        entries.push(`  <url>
    <loc>${BASE_URL}/blog/${p.slug}/</loc>
    <lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`)
      })
    } catch {}
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
