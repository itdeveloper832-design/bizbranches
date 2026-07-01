import { Metadata } from 'next'
import CitiesClient from './cities-client'
import { ORGANIC_SEED_KEYWORDS } from '@/lib/organic-keywords'

export const metadata: Metadata = {
  title: 'All Pakistan Cities Business Directory: Find Companies',
  description:
    'Browse businesses in 150 plus Pakistan cities. Find verified phone numbers, addresses, and WhatsApp contacts in Karachi, Lahore, Islamabad, and beyond.',
  keywords: [
    'Pakistan cities business directory',
    'find businesses by city Pakistan',
    'city business directory Pakistan',
    'Karachi business directory',
    'Lahore business directory',
    'Islamabad business directory',
  ],
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/cities/',
  },
}

export default function CitiesPage() {
  return <CitiesClient />
}

export const runtime = 'edge';
