import { NextResponse } from 'next/server'
import { BLOG_POSTS } from '@/lib/blog-data'

const BASE_URL = 'https://pakbizbranhces.online'

export async function GET() {
  // Use post date as lastmod for accurate freshness signals
  const activePosts = BLOG_POSTS.filter(post => !post.hidden)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/blog/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${activePosts.map(post => {
  // Parse post date for lastmod — fall back to today
  let lastmod: string
  try {
    lastmod = new Date(post.date).toISOString().split('T')[0]
  } catch {
    lastmod = new Date().toISOString().split('T')[0]
  }
  return `  <url>
    <loc>${BASE_URL}/blog/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
