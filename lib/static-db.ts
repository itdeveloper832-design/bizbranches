import staticData from './static-businesses-brief.json'

export interface StaticBusiness {
  id: string
  businessName: string
  slug: string
  city: string
  category: string
  categoryId: string
  categorySlug: string
  description: string
  phone: string
  logoUrl: string
  status: string
  isFeatured: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  rating: number
  reviewCount: number
  websiteUrl: string
  facebookPage: string
  address: string
  whatsapp: string
  email: string
  youtubeChannel: string
  subCategory: string
}

export const STATIC_BUSINESSES = staticData as StaticBusiness[]

// Find static businesses by city
export function getStaticCity(city: string): StaticBusiness[] {
  const normalized = city.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => b.city.toLowerCase() === normalized)
}

// Find static businesses by category
export function getStaticCategory(categoryId: string): StaticBusiness[] {
  const normalized = categoryId.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.categoryId.toLowerCase() === normalized || 
    b.category.toLowerCase() === normalized
  )
}

// Find static businesses by city and category
export function getStaticCityCategory(city: string, categoryId: string): StaticBusiness[] {
  const normCity = city.toLowerCase().trim()
  const normCat = categoryId.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase() === normCity && 
    (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat)
  )
}

// Find static similar businesses
export function getStaticSimilar(city: string, category: string, excludeSlug: string): StaticBusiness[] {
  const normCity = city.toLowerCase().trim()
  const normCat = category.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.city.toLowerCase() === normCity && 
    (b.categoryId.toLowerCase() === normCat || b.category.toLowerCase() === normCat) &&
    b.slug !== excludeSlug
  )
}

// Find static branches
export function getStaticBranches(businessName: string, excludeSlug: string): StaticBusiness[] {
  const normName = businessName.toLowerCase().trim()
  return STATIC_BUSINESSES.filter(b => 
    b.businessName.toLowerCase() === normName && 
    b.slug !== excludeSlug
  )
}
