import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import HeroSection from '@/components/home/hero-section'
import AboutSection from '@/components/home/about-section'
import StatsSection from '@/components/home/stats-section'
import FeaturedBusinessesSection from '@/components/featured-businesses-section'
import LatestBusinesses from '@/components/home/latest-businesses'
import CategoriesGrid from '@/components/home/categories-grid'
import CitiesGrid from '@/components/home/cities-grid'
import CTASection from '@/components/home/cta-section'
import BannerAd from '@/components/ads/banner-ad'
import NativeAd from '@/components/ads/native-ad'
import FAQSection from '@/components/home/faq-section'
import TrustSection from '@/components/home/trust-section'
import { fetchLatestBusinesses, fetchFeaturedBusinesses } from '@/lib/firebase-server'

// ISR: page is statically rendered and revalidated every 60 seconds.
// New businesses appear within 1 minute, while the HTML is served from
// the edge cache for instant mobile paint (huge LCP / TBT win).
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Free Local Business Listings',
  description:
    'Search Pakistan businesses by category and city. Find verified phone numbers, locations, and services. List your business for free today on PakBizBranches.',
  alternates: {
    canonical: 'https://pakbizbranhces.online/',
  },
  openGraph: {
    title: 'Pakistan Business Directory | Free Local Business Listings',
    description:
      'Search Pakistan businesses by category and city. Find verified phone numbers, locations, and services. List your business for free today on PakBizBranches.',
    url: 'https://pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
}

export default async function HomePage() {
  // Fetch data on the server side for better performance
  const [latestBusinesses, featuredBusinesses] = await Promise.all([
    fetchLatestBusinesses(8),
    fetchFeaturedBusinesses(4),
  ])
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />

        {/* Ad slot 1: banner below header / hero — placed AFTER H1 per spec */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BannerAd variant="inline" />
        </div>

        <AboutSection />
        <StatsSection />
        <FeaturedBusinessesSection businesses={featuredBusinesses} />

        {/* Ad slot 2: native ad between featured and latest sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NativeAd />
        </div>

        <LatestBusinesses businesses={latestBusinesses} />

        {/* Ad slot 3: banner after second business section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BannerAd variant="inline" />
        </div>

        <CategoriesGrid />
        <FAQSection />
        <TrustSection />
        <CitiesGrid />
        <CTASection />

        {/* Ad slot 4: footer banner */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
          <BannerAd variant="inline" />
        </div>
      </main>
      <Footer />
    </>
  )
}
