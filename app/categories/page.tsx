import { Metadata } from 'next'
import CategoriesClient from './categories-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Business Categories in Pakistan | Find Local Companies',
  description:
    'Browse top business categories in Pakistan and discover local companies by city. Compare listings, phone numbers, and services in one place.',
  keywords: [
    'Pakistan business categories',
    'find businesses by category Pakistan',
    'local business categories Pakistan',
    ...ORGANIC_SEED_KEYWORDS.slice(0, 8),
  ],
  alternates: {
    canonical: 'https://pakbizbranhces.online/categories/',
  },
}

export default function CategoriesPage() {
  return <CategoriesClient />
}
