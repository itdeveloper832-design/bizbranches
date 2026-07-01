import staticData from './static-businesses.json'
import { StaticBusiness } from './static-db'

export const STATIC_BUSINESSES_FULL = staticData as StaticBusiness[]

// Find static business by slug (full details for detailed page)
export function findStaticBusinessBySlug(slug: string): StaticBusiness | null {
  const normalized = slug.toLowerCase().replace(/\/$/, '')
  return STATIC_BUSINESSES_FULL.find(b => b.slug.toLowerCase() === normalized) ?? null
}
