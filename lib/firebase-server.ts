// Server-side Firebase utilities with Timestamp serialization for client components
// Optimized queries with proper filtering at database level

import { db } from './firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore'
import { LIVE_STATUSES } from './category-mappings'

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

// Fetch latest businesses - simple query without composite index
export async function fetchLatestBusinesses(count: number = 8): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      orderBy('createdAt', 'desc'),
      limit(count * 2) // Fetch more to account for status filtering
    )
    
    const snapshot = await getDocs(q)
    const businesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        businesses.push({
          id: doc.id,
          businessName: data.businessName,
          slug: data.slug,
          city: data.city,
          category: data.category,
          categoryId: data.categoryId,
          description: data.description,
          phone: data.phone,
          logoUrl: data.logoUrl,
          status: data.status,
          isFeatured: data.isFeatured,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
        })
      }
    })

    return businesses.slice(0, count)
  } catch (error) {
    console.error('Error fetching latest businesses:', error)
    return []
  }
}

// Fetch featured businesses - avoid composite index by filtering in JS
export async function fetchFeaturedBusinesses(count: number = 4): Promise<Business[]> {
  try {
    // Fetch all recent businesses, then filter for featured (avoids composite index)
    const q = query(
      collection(db, 'businesses'),
      orderBy('createdAt', 'desc'),
      limit(50) // Fetch more to find featured ones
    )
    
    const snapshot = await getDocs(q)
    const businesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()
      
      // Filter for featured and live status
      if ((data.isFeatured === true) && (!status || LIVE_STATUSES.has(status))) {
        businesses.push({
          id: doc.id,
          businessName: data.businessName,
          slug: data.slug,
          city: data.city,
          category: data.category,
          categoryId: data.categoryId,
          description: data.description,
          phone: data.phone,
          logoUrl: data.logoUrl,
          status: data.status,
          isFeatured: data.isFeatured,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
        })
      }
    })

    return businesses.slice(0, count)
  } catch (error) {
    console.error('Error fetching featured businesses:', error)
    return []
  }
}

// Fetch businesses by category - simple query
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
    const businesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        businesses.push({
          id: doc.id,
          businessName: data.businessName,
          slug: data.slug,
          city: data.city,
          category: data.category,
          categoryId: data.categoryId,
          description: data.description,
          phone: data.phone,
          logoUrl: data.logoUrl,
          status: data.status,
          isFeatured: data.isFeatured,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
        })
      }
    })

    return businesses.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching category businesses:', error)
    return []
  }
}

// Fetch businesses by city - simple query
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
    const businesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (!status || LIVE_STATUSES.has(status)) {
        businesses.push({
          id: doc.id,
          businessName: data.businessName,
          slug: data.slug,
          city: data.city,
          category: data.category,
          categoryId: data.categoryId,
          description: data.description,
          phone: data.phone,
          logoUrl: data.logoUrl,
          status: data.status,
          isFeatured: data.isFeatured,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
        })
      }
    })

    return businesses.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching city businesses:', error)
    return []
  }
}

// Fetch businesses by city and category - simple query with JS filtering to avoid index requirements
export async function fetchCityCategoryBusinesses(
  city: string,
  categoryId: string,
  pageLimit: number = 20
): Promise<Business[]> {
  try {
    // Fetch businesses by city (which we likely already have an index for)
    // then filter by category in memory to avoid needing a composite index
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', city),
      orderBy('createdAt', 'desc'),
      limit(pageLimit * 4) // Fetch more to allow for category filtering
    )

    const snapshot = await getDocs(q)
    const businesses: Business[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()
      const matchesCategory = data.categoryId === categoryId || data.category === categoryId

      if (matchesCategory && (!status || LIVE_STATUSES.has(status))) {
        businesses.push({
          id: doc.id,
          businessName: data.businessName,
          slug: data.slug,
          city: data.city,
          category: data.category,
          categoryId: data.categoryId,
          description: data.description,
          phone: data.phone,
          logoUrl: data.logoUrl,
          status: data.status,
          isFeatured: data.isFeatured,
          createdAt: serializeTimestamp(data.createdAt),
          rating: data.rating,
          reviewCount: data.reviewCount,
          websiteUrl: data.websiteUrl,
          facebookPage: data.facebookPage,
        })
      }
    })

    return businesses.slice(0, pageLimit)
  } catch (error) {
    console.error('Error fetching city category businesses:', error)
    return []
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
    const businesses: { slug: string, logoUrl?: string }[] = []
    
    snapshot.docs.forEach(doc => {
      const data = doc.data() as any
      const status = String(data.status ?? '').toLowerCase()

      if (data.slug && (!status || LIVE_STATUSES.has(status))) {
        businesses.push({
          slug: data.slug,
          logoUrl: data.logoUrl
        })
      }
    })

    return businesses
  } catch (error) {
    console.error('Error fetching all businesses for sitemap:', error)
    return []
  }
}

