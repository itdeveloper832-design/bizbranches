import { NextResponse } from 'next/server'
import { CITIES, CATEGORIES } from '@/lib/data'
import { BLOG_POSTS } from '@/lib/blog-data'
import { fetchAllBusinessesForSitemap } from '@/lib/firebase-server'

const BASE_URL = 'https://www.pakbizbranhces.online'

const TOP_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Sargodha', 'Bahawalpur', 'Sahiwal',
  'Mardan', 'Sukkur', 'Larkana', 'Gwadar', 'Muzaffarabad'
]

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0]
  
  // We will build URL items. Some can have image tags.
  interface SitemapUrl {
    loc: string
    lastmod: string
    changefreq: string
    priority: string
    image?: {
      loc: string
      title: string
    }
  }

  const urls: SitemapUrl[] = []

  // 1. Static Pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/categories/', priority: '0.9', changefreq: 'weekly' },
    { url: '/cities/', priority: '0.9', changefreq: 'weekly' },
    { url: '/add-business/', priority: '0.9', changefreq: 'monthly' },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: '/about/', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.7', changefreq: 'monthly' },
    { url: '/featured-businesses/', priority: '0.8', changefreq: 'daily' },
    { url: '/html-sitemap/', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy/', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms/', priority: '0.4', changefreq: 'yearly' },
  ]

  staticPages.forEach(p => {
    urls.push({
      loc: `${BASE_URL}${p.url}`,
      lastmod,
      changefreq: p.changefreq,
      priority: p.priority
    })
  })

  // 2. Categories
  CATEGORIES.forEach(cat => {
    urls.push({
      loc: `${BASE_URL}/${cat.id}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.9'
    })
  })

  // 3. Cities
  CITIES.forEach(city => {
    const citySlug = city.toLowerCase().replace(/ /g, '-')
    urls.push({
      loc: `${BASE_URL}/${citySlug}/`,
      lastmod,
      changefreq: 'weekly',
      priority: '0.8'
    })
  })

  // 4. Top Cities + Category combinations
  TOP_CITIES.forEach(city => {
    const citySlug = city.toLowerCase().replace(/ /g, '-')
    CATEGORIES.forEach(cat => {
      urls.push({
        loc: `${BASE_URL}/${citySlug}/${cat.id}/`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.7'
      })
    })
  })

  // 5. Blog posts (including images)
  const activePosts = BLOG_POSTS.filter(post => !post.hidden)
  activePosts.forEach(post => {
    const urlItem: SitemapUrl = {
      loc: `${BASE_URL}/blog/${post.slug}/`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7'
    }
    if ((post as any).image) {
      urlItem.image = {
        loc: `${BASE_URL}${(post as any).image}`,
        title: post.title
      }
    }
    urls.push(urlItem)
  })

  // 6. Business Listings
  try {
    const businesses = await fetchAllBusinessesForSitemap()
    businesses.forEach(biz => {
      urls.push({
        loc: `${BASE_URL}/${biz.slug}/`,
        lastmod,
        changefreq: 'weekly',
        priority: '0.75',
        ...(biz.logoUrl ? {
          image: {
            loc: biz.logoUrl,
            title: biz.slug.replace(/-/g, ' ')
          }
        } : {})
      })
    })
  } catch (error) {
    console.error('Error fetching businesses for sitemap.xml:', error)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.image ? `
    <image:image>
      <image:loc>${u.image.loc}</image:loc>
      <image:title>${u.image.title}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}

export const runtime = 'edge';
