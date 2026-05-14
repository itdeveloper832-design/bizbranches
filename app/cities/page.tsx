import { Metadata } from 'next'
import CitiesClient from './cities-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

export const metadata: Metadata = {
  title: 'Pakistan Cities Business Directory | Find Local Businesses by City 2026',
  description:
    'Browse 150+ Pakistan cities and find verified local businesses by category, phone number, and address. City-wise business discovery for Karachi, Lahore, Islamabad & more.',
  keywords: [
    'Pakistan cities business directory',
    'find businesses by city Pakistan',
    'city business directory Pakistan',
    'Karachi business directory',
    'Lahore business directory',
    'Islamabad business directory',
  ],
  alternates: {
    canonical: 'https://pakbizbranhces.online/cities/',
  },
}

export default function CitiesPage() {
  return <CitiesClient />
}
