import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { CITIES, CATEGORIES } from '@/lib/data'
import { LIVE_STATUSES } from '@/lib/category-mappings'

const BASE_URL = 'https://pakbizbranhces.online'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/categories/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/add-business/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Bank branch pages (SEO optimized for specific keywords)
  const bankBranchPages: MetadataRoute.Sitemap = [
    { 
      url: `${BASE_URL}/habib-bank-limited-f-10-markaz-branch-islamabad/`, 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.9 
    },
    { 
      url: `${BASE_URL}/standard-chartered-bank-johar-town-branch-lahore/`, 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.9 
    },
  ]


  // Blog post pages - Limited to 15 posts max (uncomment as needed daily)
  let blogPages: MetadataRoute.Sitemap = []
  try {
    // Try to get blog posts from Firebase first
    const blogSnap = await getDocs(collection(db, 'blogPosts'))
    blogPages = blogSnap.docs
      .slice(0, 15) // Limit to first 15 posts
      .map(doc => {
        const blog = doc.data()
        return {
          url: `${BASE_URL}/blog/${doc.id}/`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt.toDate?.() ?? blog.updatedAt) : new Date(blog.date || now),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })
  } catch (error) {
    console.log('Firebase blog posts not available, trying static data')
    try {
      // Fallback to static blog data - Limited to 15 posts
      const { BLOG_POSTS } = await import('@/lib/blog-data')
      
      // Filter out hidden posts and limit to 15
      const activePosts = BLOG_POSTS.filter(post => !post.hidden).slice(0, 15)
      
      blogPages = activePosts.map(post => ({
        url: `${BASE_URL}/blog/${post.slug}/`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    } catch (staticError) {
      console.log('Static blog data not available')
    }
  }

  // Dynamic business pages
  let businessPages: MetadataRoute.Sitemap = []
  const activeCitiesCount = new Map<string, number>()
  const activeCategoriesCount = new Map<string, number>()
  const activeCityCategoryPairsCount = new Map<string, number>()

  try {
    const q = query(collection(db, 'businesses'))
    const snap = await getDocs(q)
    
    businessPages = snap.docs
      .map(doc => {
        const data = doc.data() as any
        return { id: doc.id, ...data }
      })
      .filter((business: any) => {
        const status = String(business.status ?? '').toLowerCase()
        return !status || LIVE_STATUSES.has(status)
      })
      .map((data: any) => {
        const citySlug = data.city?.toLowerCase().replace(/ /g, '-')
        const categorySlug = data.category
        
        if (citySlug) activeCitiesCount.set(citySlug, (activeCitiesCount.get(citySlug) || 0) + 1)
        if (categorySlug) activeCategoriesCount.set(categorySlug, (activeCategoriesCount.get(categorySlug) || 0) + 1)
        if (citySlug && categorySlug) {
          const pair = `${citySlug}|${categorySlug}`
          activeCityCategoryPairsCount.set(pair, (activeCityCategoryPairsCount.get(pair) || 0) + 1)
        }

        return {
          url: data.slug ? `${BASE_URL}/${data.slug}/` : `${BASE_URL}/business/${data.id}/`,
          lastModified: data.updatedAt ? new Date(data.updatedAt.toDate?.() ?? data.updatedAt) : (data.createdAt ? new Date(data.createdAt.toDate?.() ?? data.createdAt) : now),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }
      })
  } catch (error) {
    console.error('Error fetching businesses for sitemap:', error)
  }

  // Filtered programmatic city pages (require at least 3 businesses to prevent thin content)
  const cityPages: MetadataRoute.Sitemap = Array.from(activeCitiesCount.entries())
    .filter(([_, count]) => count >= 3)
    .map(([citySlug]) => ({
      url: `${BASE_URL}/cities/${citySlug}/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }))

  // Filtered programmatic category pages (require at least 3 businesses)
  const categoryPages: MetadataRoute.Sitemap = Array.from(activeCategoriesCount.entries())
    .filter(([_, count]) => count >= 3)
    .map(([catSlug]) => ({
      url: `${BASE_URL}/categories/${catSlug}/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }))

  // Filtered City + Category pages (require at least 3 businesses to prevent thin content indexing issues)
  const cityCategoryPages: MetadataRoute.Sitemap = Array.from(activeCityCategoryPairsCount.entries())
    .filter(([_, count]) => count >= 3)
    .map(([pair]) => {
      const [citySlug, catSlug] = pair.split('|')
      return {
        url: `${BASE_URL}/locations/${citySlug}/${catSlug}/`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }
    })

  return [
    ...staticPages,
    ...bankBranchPages,
    ...cityPages,
    ...categoryPages,
    ...cityCategoryPages,
    ...blogPages,
    ...businessPages,
  ]
}
