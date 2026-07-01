import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RealEstateClient from '@/components/category/real-estate-client'

export const metadata: Metadata = {
  title: 'Best Real Estate Services in Pakistan: Verified Agencies',
  description: 'Find the best real estate agents and property consultants in Pakistan. Get verified phone numbers, offices, and WhatsApp contacts for free.',
  keywords: 'real estate Pakistan, property agents Pakistan, verified real estate agents, property consultants Karachi, Lahore real estate, Islamabad property dealers',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/category/real-estate/',
  },
}

export default function RealEstatePage() {
  return (
    <>
      <Navbar />
      <RealEstateClient />
      <Footer />
    </>
  )
}

export const runtime = 'edge';
