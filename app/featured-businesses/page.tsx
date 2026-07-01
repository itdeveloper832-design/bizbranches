import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FeaturedBusinessesClient from '@/components/featured-businesses-client'

export const metadata: Metadata = {
  title: 'Featured Businesses: Verified Pakistan Companies',
  description:
    'Browse featured businesses in Pakistan. Find premium verified listings across all cities, including top restaurants, real estate, and local shops.',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/featured-businesses/',
  },
}

export default function FeaturedBusinessesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-600 bg-amber-100 rounded-full mb-3">
              PREMIUM LISTINGS
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
              Featured Businesses
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Discover premium businesses that stand out from the rest
            </p>
          </div>

          {/* Filters and Content */}
          <FeaturedBusinessesClient />
        </div>
      </main>
      <Footer />
    </>
  )
}

export const runtime = 'edge';
