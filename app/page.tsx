import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import HeroSection from '@/components/home/hero-section'
import dynamic from 'next/dynamic'
import { fetchLatestBusinesses, fetchFeaturedBusinesses } from '@/lib/firebase-server'
import { CATEGORIES, CITIES } from '@/lib/data'
import Link from 'next/link'
import { BannerAdLoader, NativeAdLoader } from '@/components/ads/ads-loader'

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

// ISR: page is statically rendered and revalidated every 60 seconds.
export const revalidate = 60

const BASE_URL = 'https://pakbizbranhces.online'

export const metadata: Metadata = {
  title: 'Pakistan Business Directory: Search Local Services',
  description:
    'Search verified businesses in Pakistan. Find phone numbers, WhatsApp, and addresses for local services. List your business free on PakBizBranches.',
  keywords:
    'Pakistan business directory, free business listing Pakistan, Karachi business listings, Lahore business directory, Islamabad business listings, local services Pakistan, business phone numbers Pakistan, verified business contacts Pakistan, find businesses Pakistan 2026',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online/' }],
  alternates: {
    canonical: 'https://pakbizbranhces.online/',
  },
  openGraph: {
    title: 'Pakistan Business Directory: Search Local Services',
    description:
      'Search verified businesses in Pakistan. Find phone numbers, WhatsApp, and addresses for local services. List your business free on PakBizBranches.',
    url: 'https://pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
}

// FAQ data for homepage schema
const homeFaqs = [
  {
    q: "What is the best free business listing site in Pakistan without registration?",
    a: "PakBizBranches is the best free business listing site in Pakistan that requires no registration. Business owners can submit their listings in five minutes, while local users get instant access to verified phone numbers, direct WhatsApp chat links, and physical addresses across Karachi, Lahore, and Islamabad without login barriers."
  },
  {
    q: "How do I verify if a business is registered with SECP and FBR in Pakistan?",
    a: "To verify a business, request their National Tax Number or SECP registration number. You can search these details on the FBR Active Taxpayer List portal or the SECP online company registration registry to confirm the business's legal name, status, and physical office details."
  },
  {
    q: "Why do many local directories block phone numbers behind login walls?",
    a: "Many directories block contact info to force user registration and harvest email data for marketing. Portals like PakBizBranches address this issue by displaying verified phone numbers and click to WhatsApp links publicly, allowing immediate consumer to business contact without signups."
  },
  {
    q: "Can I list my business on Google Maps in Pakistan without a postcard code?",
    a: "Yes. While Google Maps usually requires a postcard verification code which often fails to arrive in Pakistan, you can verify your profile using video verification, live phone calls, or by building matching local directory citations on authoritative platforms like PakBizBranches."
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
          <BannerAdLoader variant="inline" />
        </div>

        <AboutSection />
        <StatsSection />
        <FeaturedBusinessesSection businesses={featuredBusinesses} />

        {/* Ad slot 2: native ad between featured and latest sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NativeAdLoader />
        </div>

        <LatestBusinesses businesses={latestBusinesses} />

        {/* Ad slot 3: banner after second business section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BannerAdLoader variant="inline" />
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
        <section className="py-16 bg-[#f8fafc]" aria-labelledby="why-pakbizbranches-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="why-pakbizbranches-heading" className="text-3xl font-bold text-[#0f2b3d] mb-8 text-center">
              Why Use PakBizBranches?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-gray-800">
                PakBizBranches is a free business directory for finding verified companies across Pakistan. Local people use our platform to search for active business contact details and direct WhatsApp chat links. Our service covers over one hundred and fifty cities. We help small businesses connect with clients without charging any listing fees.
              </p>

              <h3 className="text-xl font-semibold text-[#0f2b3d] mt-8">
                Find Verified Businesses Across Pakistan’s Major Cities
              </h3>
              <p>
                Finding a reliable shop or service provider in local markets can be difficult. Outdated phone numbers on old search portals lead to dead ends. PakBizBranches resolves this problem. Our platform lists verified phone numbers and exact location addresses for companies in major urban centers.
              </p>
              <p>
                In Karachi, we list offices located in Clifton Block 5, Bahadurabad, and the SITE Area. If you need a software developer or exporter near Shahrah e Faisal, you can search our listings. We also cover businesses near Tariq Road and the Korangi Industrial Area, as well as educational service listings close to NED University and Karachi University.
              </p>
              <p>
                In Lahore, our directory maps service providers in Gulberg III, DHA Phase 5, and along Ferozepur Road. If you are searching for computer shops near Hall Road or retail outlets in Liberty Market, you can find their active WhatsApp links here. We also include schools and training academies located near Punjab University, Lahore University of Management Sciences, and Government College University.
              </p>
              <p>
                In Islamabad, we list corporate offices in the Blue Area, G 9 Markaz, and the I 8 Sector. In Rawalpindi, users can find local repair services, medical clinics, and stores near Murree Road, Saddar, and the Commercial Market, including businesses near Gordon College.
              </p>

              <h3 className="text-xl font-semibold text-[#0f2b3d] mt-8">
                Browse Local Companies by Category
              </h3>
              <p>
                We organize our listings into clear business categories. This makes it simple to browse specific industries. You can locate medical clinics, software houses, property dealers, wedding halls, and logistics providers.
              </p>
              <p>
                For instance, instead of searching blindly for a technician, you can browse our auto repair or home services sections. Every category page lists active local services with real user feedback. This helps you compare different service providers before contacting them.
              </p>

              <h3 className="text-xl font-semibold text-[#0f2b3d] mt-8">
                Why List Your Business on PakBizBranches?
              </h3>
              <p>
                If you run a business in Pakistan, establishing a digital presence is crucial. Building a custom website can be expensive. Promoting your services on social media groups is time consuming. A listing on a local citation directory solves these challenges.
              </p>

              <h4 className="text-lg font-semibold text-[#0f2b3d] mt-6">
                100% Free Listing With Instant Online Approval
              </h4>
              <p>
                We do not charge any registration fees or annual subscription costs. You can add your business detail for free in under five minutes. Our administrative team reviews every submission to maintain high database quality.
              </p>
              <p>
                To build trust with customers, you can include your business registration details. If your business is registered with the Federal Board of Revenue, you can add your FBR NTN. If you are incorporated, you can reference your Securities and Exchange Commission of Pakistan registration details. Adding affiliation signals from the Karachi Chamber of Commerce and Industry or the Lahore Chamber of Commerce and Industry helps verify your company profile.
              </p>

              <h4 className="text-lg font-semibold text-[#0f2b3d] mt-6">
                Direct Call and WhatsApp Contact Without Registration Walls
              </h4>
              <p>
                Most directory portals hide business contact details behind registration walls. They force users to create an account or pay a fee to see a phone number. This setup hurts small businesses because it blocks potential leads.
              </p>
              <p>
                PakBizBranches is different. We show phone numbers and click to WhatsApp buttons openly on every business profile. Customers can call you or start a chat directly from their mobile phones. This setup removes all friction and speeds up business transactions.
              </p>

              <h3 className="text-xl font-semibold text-[#0f2b3d] mt-8">
                Citing Official Local Authority Resources
              </h3>
              <p>
                We encourage business owners to verify their legal standing. You can find official business registration forms and tax guidelines on the government portals. Check the official taxpayer status on the FBR website or verify corporate records through the SECP portal. Local business chambers like KCCI and LCCI also offer resources for trade registration and export certifications.
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
          <BannerAdLoader variant="inline" />
        </div>
      </main>
      <Footer />
    </>
  )
}
