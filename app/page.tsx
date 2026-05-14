import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import HeroSection from '@/components/home/hero-section'
import dynamic from 'next/dynamic'
import { fetchLatestBusinesses, fetchFeaturedBusinesses } from '@/lib/firebase-server'
import { CATEGORIES, CITIES } from '@/lib/data'
import Link from 'next/link'

// ─── Above-the-fold: loaded eagerly ─────────────────────────────────────────
import AboutSection from '@/components/home/about-section'
import StatsSection from '@/components/home/stats-section'

// ─── Below-the-fold: dynamically imported to reduce initial JS bundle ────────
const FeaturedBusinessesSection = dynamic(
  () => import('@/components/featured-businesses-section'),
  { ssr: true }
)
const LatestBusinesses = dynamic(
  () => import('@/components/home/latest-businesses'),
  { ssr: true }
)
const CategoriesGrid = dynamic(
  () => import('@/components/home/categories-grid'),
  { ssr: true }
)
const CitiesGrid = dynamic(
  () => import('@/components/home/cities-grid'),
  { ssr: true }
)
const CTASection = dynamic(
  () => import('@/components/home/cta-section'),
  { ssr: true }
)
const FAQSection = dynamic(
  () => import('@/components/home/faq-section'),
  { ssr: true }
)
const TrustSection = dynamic(
  () => import('@/components/home/trust-section'),
  { ssr: true }
)
const BannerAd = dynamic(
  () => import('@/components/ads/banner-ad'),
  { ssr: false }
)
const NativeAd = dynamic(
  () => import('@/components/ads/native-ad'),
  { ssr: false }
)

// ISR: page is statically rendered and revalidated every 60 seconds.
export const revalidate = 60

const BASE_URL = 'https://pakbizbranhces.online'

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Find Businesses in Karachi, Lahore & All Cities – PakBizBranches',
  description:
    'Discover verified businesses across Pakistan. Search by city, category, or business name. Free business listings for Karachi, Lahore, Islamabad & more. Updated 2026.',
  keywords:
    'Pakistan business directory, free business listing Pakistan, Karachi business listings, Lahore business directory, Islamabad business listings, local services Pakistan, business phone numbers Pakistan, verified business contacts Pakistan, find businesses Pakistan 2026',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online/' }],
  alternates: {
    canonical: 'https://pakbizbranhces.online/',
  },
  openGraph: {
    title: 'Pakistan Business Directory | Find Businesses in Karachi, Lahore & All Cities – PakBizBranches',
    description:
      'Discover verified businesses across Pakistan. Search by city, category, or business name. Free business listings for Karachi, Lahore, Islamabad & more.',
    url: 'https://pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
}

// FAQ data for homepage schema
const homeFaqs = [
  {
    q: "What is PakBizBranches?",
    a: "PakBizBranches is Pakistan's #1 free business directory. Find verified local businesses by city and category across 150+ cities including Karachi, Lahore, Islamabad, and more."
  },
  {
    q: "How do I find businesses in my city?",
    a: "Use the search bar on our homepage to search by business name, category, or city. You can also browse by city or category using the navigation links."
  },
  {
    q: "Is it free to list my business on PakBizBranches?",
    a: "Yes, 100% free. There are no hidden charges or subscriptions. Simply submit your business details and our team will review and publish your listing within 24 hours."
  },
  {
    q: "Which cities are covered in PakBizBranches?",
    a: "We cover 150+ cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, and many more."
  },
  {
    q: "What business categories are available?",
    a: "We cover 12+ major categories including Restaurants & Food, Real Estate, Healthcare & Medical, Technology & IT, Education, Retail, Automotive, Finance, Beauty & Wellness, and more."
  },
  {
    q: "How do I contact a business listed on PakBizBranches?",
    a: "Each business listing includes direct phone numbers, WhatsApp contacts, and addresses. Simply click on any listing to view full contact details."
  }
]

export default async function HomePage() {
  const [latestBusinesses, featuredBusinesses] = await Promise.all([
    fetchLatestBusinesses(8),
    fetchFeaturedBusinesses(4),
  ])

  // Homepage FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  }

  // Top cities for internal linking
  const topCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala']

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main id="main-content">
        <HeroSection />

        {/* Ad slot 1: banner below header / hero */}
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

        {/* SEO Internal Linking Section — Top Business Categories */}
        <section className="py-12 bg-[#f8fafc]" aria-labelledby="top-categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="top-categories-heading" className="text-2xl md:text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Top Business Categories in Pakistan
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse Pakistan's most popular business categories. Find verified phone numbers, addresses, and WhatsApp contacts for every type of business.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/${cat.id}/`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors shadow-sm"
                  title={`Find ${cat.name} businesses in Pakistan`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                  <span className="text-xs text-gray-400">({cat.count.toLocaleString()})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Internal Linking Section — Popular Cities */}
        <section className="py-12 bg-white" aria-labelledby="popular-cities-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="popular-cities-heading" className="text-2xl md:text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Popular Cities — Find Local Businesses Near You
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Pakistan's largest cities covered. Click your city to browse all local businesses, restaurants, clinics, and services.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {topCities.map(city => (
                <Link
                  key={city}
                  href={`/${city.toLowerCase().replace(/ /g, '-')}/`}
                  className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] rounded-xl text-white text-center hover:from-[#1a3f57] hover:to-[#0f2b3d] transition-all shadow-sm"
                  title={`Business directory for ${city}, Pakistan`}
                >
                  <span className="font-semibold text-sm">{city}</span>
                  <span className="text-xs text-white/60 mt-0.5">View Businesses</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/cities/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3f57] transition-colors"
              >
                View All 150+ Cities →
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Section — Why Use PakBizBranches */}
        <section className="py-12 bg-[#f8fafc]" aria-labelledby="why-pakbizbranches-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="why-pakbizbranches-heading" className="text-2xl md:text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Why Use PakBizBranches?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>
                <strong>PakBizBranches</strong> is Pakistan's most trusted free business directory, connecting millions of customers with verified local businesses across 150+ cities. Whether you're searching for the best restaurants in Karachi, top real estate agents in Lahore, IT companies in Islamabad, or healthcare clinics in Rawalpindi — we have you covered.
              </p>
              <p className="mt-4">
                Our directory features <strong>15,000+ verified business listings</strong> with direct phone numbers, WhatsApp contacts, and addresses. Every listing is reviewed by our team to ensure accuracy. Best of all, listing your business is completely <strong>free — no registration required</strong>.
              </p>
              <p className="mt-4">
                Updated in 2026, PakBizBranches covers all major business categories including restaurants, real estate, healthcare, technology, education, retail, automotive, finance, beauty, logistics, construction, and travel. Find any business, in any city, in seconds.
              </p>
            </div>
          </div>
        </section>

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
