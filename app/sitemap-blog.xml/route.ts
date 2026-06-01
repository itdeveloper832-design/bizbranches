import { NextResponse } from 'next/server'
import { BLOG_POSTS } from '@/lib/blog-data'

const BASE_URL = 'https://pakbizbranches.online'

export async function GET() {
  // Use post date as lastmod for accurate freshness signals
  const activePosts = BLOG_POSTS.filter(post => !post.hidden)

  const lastmod = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/blog/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${activePosts.map(post => {
  return `  <url>
    <loc>${BASE_URL}/blog/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
