import { Metadata } from 'next'
import CategoriesClient from './categories-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

export const metadata: Metadata = {
  title: 'Business Categories in Pakistan | Browse All Sectors – PakBizBranches',
  description:
    'Browse 12+ business categories in Pakistan. Find verified restaurants, real estate, healthcare, technology, retail, automotive, beauty & more. Free local business directory.',
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
    canonical: 'https://pakbizbranhces.online/categories/',
  },
}

export default function CategoriesPage() {
  return <CategoriesClient />
}
