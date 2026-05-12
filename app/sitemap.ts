import { MetadataRoute } from 'next'

export const revalidate = 3600 // regenerate index every hour
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  // Sitemap index — points to child sitemaps served from /app/sitemaps/*/route.ts
  return [
    { url: `${BASE_URL}/sitemaps/static.xml`,     lastModified: now },
    { url: `${BASE_URL}/sitemaps/categories.xml`, lastModified: now },
    { url: `${BASE_URL}/sitemaps/cities.xml`,     lastModified: now },
    { url: `${BASE_URL}/sitemaps/locations.xml`,  lastModified: now },
    { url: `${BASE_URL}/sitemaps/blogs.xml`,      lastModified: now },
    { url: `${BASE_URL}/sitemaps/businesses.xml`, lastModified: now },
  ]
}
