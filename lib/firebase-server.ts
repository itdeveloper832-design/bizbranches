// Server-side Firebase utilities with Timestamp serialization for client components
// Optimized queries with proper filtering at database level and static caching fallback

import { db } from './firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { LIVE_STATUSES } from './category-mappings'
import { STATIC_BUSINESSES } from './static-db'

export interface Business {
  id: string
  businessName: string
  slug?: string
  city: string
  category: string
  categoryId?: string
  description: string
  phone: string
  logoUrl?: string
  status: string
  isFeatured?: boolean
  createdAt: string // ISO string for client serialization
  rating?: number
  reviewCount?: number
  websiteUrl?: string
  facebookPage?: string
  address?: string
  whatsapp?: string
  email?: string
  youtubeChannel?: string
  subCategory?: string
}

// Helper: Convert Firestore Timestamp to ISO string
function serializeTimestamp(timestamp: any): string {
  if (!timestamp) return new Date().toISOString()
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString()
  }
  
  if (timestamp.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000).toISOString()
  }
  
  if (typeof timestamp === 'string') {
    return timestamp
  }
  
  return new Date().toISOString()
}

// Fetch latest businesses - merging static & dynamic
export async function fetchLatestBusinesses(count: number = 8): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      orderBy('createdAt', 'desc'),
      limit(count * 2) // Fetch more to account for status filtering
    )
    
    const snapshot = await getDocs(q)
    const dbBusinesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        dbBusinesses.push({
          id: doc.id,
          businessName: data.businessName || '',
          slug: data.slug || '',
          city: data.city || '',
          category: data.category || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || '',
          status: data.status || 'approved',
          isFeatured: data.isFeatured || false,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
          address: data.address,
          whatsapp: data.whatsapp,
          email: data.email,
          youtubeChannel: data.youtubeChannel,
          subCategory: data.subCategory
        })
      }
    })

    const merged = new Map<string, Business>()
    // Add static businesses first
    STATIC_BUSINESSES.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })
    // Add dynamic (overwrites if matching slug)
    dbBusinesses.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })

    const all = Array.from(merged.values())
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all.slice(0, count)
  } catch (error) {
    console.error('Error fetching latest businesses:', error)
    const all = [...STATIC_BUSINESSES]
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return all.slice(0, count)
  }
}

// Fetch featured businesses - merging static & dynamic
export async function fetchFeaturedBusinesses(count: number = 4): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
    
    const snapshot = await getDocs(q)
    const dbBusinesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()
      const isFeatured = !!data.isFeatured
      
      if (isFeatured && (!status || LIVE_STATUSES.has(status))) {
        dbBusinesses.push({
          id: doc.id,
          businessName: data.businessName || '',
          slug: data.slug || '',
          city: data.city || '',
          category: data.category || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || '',
          status: data.status || 'approved',
          isFeatured: true,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
          address: data.address,
          whatsapp: data.whatsapp,
          email: data.email,
          youtubeChannel: data.youtubeChannel,
          subCategory: data.subCategory
        })
      }
    })

    const merged = new Map<string, Business>()
    STATIC_BUSINESSES.forEach(b => {
      if (b.slug && (b.isFeatured || b.featured)) {
        merged.set(b.slug, b)
      }
    })
    dbBusinesses.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })

    const all = Array.from(merged.values())
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all.slice(0, count)
  } catch (error) {
    console.error('Error fetching featured businesses:', error)
    const all = STATIC_BUSINESSES.filter(b => b.isFeatured || b.featured)
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return all.slice(0, count)
  }
}

// Fetch businesses by category
export async function fetchCategoryBusinesses(
  categoryId: string,
  pageLimit: number = 20
): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('categoryId', '==', categoryId),
      orderBy('createdAt', 'desc'),
      limit(pageLimit * 2)
    )

    const snapshot = await getDocs(q)
    const dbBusinesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        dbBusinesses.push({
          id: doc.id,
          businessName: data.businessName || '',
          slug: data.slug || '',
          city: data.city || '',
          category: data.category || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || '',
          status: data.status || 'approved',
          isFeatured: data.isFeatured || false,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
          address: data.address,
          whatsapp: data.whatsapp,
          email: data.email,
          youtubeChannel: data.youtubeChannel,
          subCategory: data.subCategory
        })
      }
    })

    const merged = new Map<string, Business>()
    const normCat = categoryId.toLowerCase().trim()
    STATIC_BUSINESSES.forEach(b => {
      if (b.slug && (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat)) {
        merged.set(b.slug, b)
      }
    })
    dbBusinesses.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })

    const all = Array.from(merged.values())
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching category businesses:', error)
    const normCat = categoryId.toLowerCase().trim()
    const all = STATIC_BUSINESSES.filter(b => b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat)
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return all.slice(0, pageLimit)
  }
}

// Fetch businesses by city
export async function fetchCityBusinesses(
  city: string,
  pageLimit: number = 20
): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', city),
      orderBy('createdAt', 'desc'),
      limit(pageLimit * 2)
    )

    const snapshot = await getDocs(q)
    const dbBusinesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        dbBusinesses.push({
          id: doc.id,
          businessName: data.businessName || '',
          slug: data.slug || '',
          city: data.city || '',
          category: data.category || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || '',
          status: data.status || 'approved',
          isFeatured: data.isFeatured || false,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
          address: data.address,
          whatsapp: data.whatsapp,
          email: data.email,
          youtubeChannel: data.youtubeChannel,
          subCategory: data.subCategory
        })
      }
    })

    const merged = new Map<string, Business>()
    const normCity = city.toLowerCase().trim()
    STATIC_BUSINESSES.forEach(b => {
      if (b.slug && b.city.toLowerCase() === normCity) {
        merged.set(b.slug, b)
      }
    })
    dbBusinesses.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })

    const all = Array.from(merged.values())
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching city businesses:', error)
    const normCity = city.toLowerCase().trim()
    const all = STATIC_BUSINESSES.filter(b => b.city.toLowerCase() === normCity)
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return all.slice(0, pageLimit)
  }
}

// Fetch businesses by city and category
export async function fetchCityCategoryBusinesses(
  city: string,
  categoryId: string,
  pageLimit: number = 20
): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', city),
      orderBy('createdAt', 'desc'),
      limit(pageLimit * 4)
    )

    const snapshot = await getDocs(q)
    const dbBusinesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()
      const matchesCategory = data.categoryId === categoryId || data.category === categoryId

      if (matchesCategory && (!status || LIVE_STATUSES.has(status))) {
        dbBusinesses.push({
          id: doc.id,
          businessName: data.businessName || '',
          slug: data.slug || '',
          city: data.city || '',
          category: data.category || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          phone: data.phone || '',
          logoUrl: data.logoUrl || '',
          status: data.status || 'approved',
          isFeatured: data.isFeatured || false,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
          address: data.address,
          whatsapp: data.whatsapp,
          email: data.email,
          youtubeChannel: data.youtubeChannel,
          subCategory: data.subCategory
        })
      }
    })

    const merged = new Map<string, Business>()
    const normCity = city.toLowerCase().trim()
    const normCat = categoryId.toLowerCase().trim()
    
    STATIC_BUSINESSES.forEach(b => {
      const matchCat = b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat
      if (b.slug && b.city.toLowerCase() === normCity && matchCat) {
        merged.set(b.slug, b)
      }
    })
    dbBusinesses.forEach(b => {
      if (b.slug) merged.set(b.slug, b)
    })

    const all = Array.from(merged.values())
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching city category businesses:', error)
    const normCity = city.toLowerCase().trim()
    const normCat = categoryId.toLowerCase().trim()
    const all = STATIC_BUSINESSES.filter(b => 
      b.city.toLowerCase() === normCity && 
      (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat)
    )
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return all.slice(0, pageLimit)
  }
}

// Fetch ALL approved businesses for sitemap
export async function fetchAllBusinessesForSitemap(): Promise<{ slug: string, logoUrl?: string }[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const dbSitemapItems: { slug: string, logoUrl?: string }[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (data.slug && (!status || LIVE_STATUSES.has(status))) {
        dbSitemapItems.push({
          slug: data.slug,
          logoUrl: data.logoUrl
        })
      }
    })

    const merged = new Map<string, { slug: string, logoUrl?: string }>()
    
    // Add static ones
    STATIC_BUSINESSES.forEach(b => {
      if (b.slug) {
        merged.set(b.slug, { slug: b.slug, logoUrl: b.logoUrl })
      }
    })

    // Add dynamic ones
    dbSitemapItems.forEach(item => {
      merged.set(item.slug, item)
    })

    return Array.from(merged.values())
  } catch (error) {
    console.error('Error fetching all businesses for sitemap:', error)
    return STATIC_BUSINESSES.map(b => ({ slug: b.slug, logoUrl: b.logoUrl }))
  }
}
