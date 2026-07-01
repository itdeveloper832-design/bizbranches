import { Metadata } from 'next'
import CategoriesClient from './categories-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

export const metadata: Metadata = {
  title: 'Business Categories: Find Local Service Sectors',
  description:
    'Browse all business categories in Pakistan. Find verified listings for restaurants, real estate, technology, healthcare, and retail near you.',
  keywords: [
    'Pakistan business categories',
    'find businesses by category Pakistan',
    'restaurants Pakistan directory',
    'healthcare businesses Pakistan',
    'real estate Pakistan directory',
    'technology companies Pakistan',
    'retail businesses Pakistan',
    'beauty salons Pakistan',
  ],
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/categories/',
  },
}

export default function CategoriesPage() {
  return <CategoriesClient />
}

