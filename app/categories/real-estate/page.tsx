import { Metadata } from 'next'
import RealEstateClient from './real-estate-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Real Estate Pakistan: Property and Housing Directory',
  description: 'Find top real estate agents and builders in Pakistan. Access verified contacts, office addresses, and listings. Contact property experts today.',
  keywords: 'Pakistan real estate, property directory Pakistan, real estate agents Pakistan, housing Pakistan, property dealers Pakistan, commercial property Pakistan, residential property Pakistan',
}

export default function RealEstatePage() {
  return <RealEstateClient />
}

