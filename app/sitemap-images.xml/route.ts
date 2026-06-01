import { NextResponse } from 'next/server'
import { BLOG_POSTS } from '@/lib/blog-data'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'

const BASE_URL = 'https://www.pakbizbranhces.online'

export async function GET() {
  const lastmod = '2026-05-19'
  const businesses = await fetchAllBusinessesForSitemap()
  const activePosts = BLOG_POSTS.filter(post => !post.hidden)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${activePosts.filter(p => (p as any).image).map(post => `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}/</loc>
    <image:image>
      <image:loc>${BASE_URL}${(post as any).image}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('')}
  ${businesses.filter(b => b.logoUrl).map(biz => `
  <url>
    <loc>${BASE_URL}/${biz.slug}/</loc>
    <image:image>
      <image:loc>${biz.logoUrl}</image:loc>
      <image:title>${biz.slug.replace(/-/g, ' ')}</image:title>
    </image:image>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
