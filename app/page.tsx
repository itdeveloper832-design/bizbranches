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
    q: "What Is PakBizBranches and How Does It Work?",
    a: "PakBizBranches is an online Pakistan business directory that helps local business owners across the country display their contact details and connect with buyers. You pay no fees, need no credit card, and your listing never expires."
  },
  {
    q: "Is PakBizBranches Really Free? What's the Catch?",
    a: "Listing your business on PakBizBranches is free, does not require a credit card, and has no expiry date or trial period limits."
  },
  {
    q: "How Do I Find a Verified Business in Pakistan?",
    a: "You can find a verified business in Pakistan on PakBizBranches, where our team manually checks each listing details before publishing the profile live on our site."
  },
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

  // Testimonials and Aggregate Rating Schema
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'PakBizBranches',
    'image': 'https://pakbizbranhces.online/logo.png',
    'description': 'Pakistan Business Directory: Search Local Services. List your business free on PakBizBranches.',
    'brand': {
      '@type': 'Brand',
      'name': 'PakBizBranches'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'reviewCount': '3'
    },
    'review': [
      {
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': 'Muhammad Usman Butt'
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        },
        'reviewBody': 'I listed my auto spare parts shop here and felt surprised when customers actually called. Within the first month, I got 4 to 6 new customer calls per week. They specifically told me they found my shop on this directory. Yeh service sach mein kaam ayi.',
        'itemReviewed': {
          '@type': 'Product',
          'name': 'PakBizBranches'
        }
      },
      {
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': 'Sana Fatima'
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        },
        'reviewBody': 'Before listing on this directory, my home catering service had no online presence. I did not expect a free platform to work, but I got my first three orders from outside my friend circle within two weeks. I appreciate how this site helps small home businesses grow.',
        'itemReviewed': {
          '@type': 'Product',
          'name': 'PakBizBranches'
        }
      },
      {
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': 'Farhan Ahmed Siddiqui'
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '4',
          'bestRating': '5'
        },
        'reviewBody': 'The WhatsApp contact button on my listing is now my primary source for new business inquiries. I get 8 to 12 WhatsApp messages every week from potential clients in Karachi. This free listing saved my solar company from paying for expensive online advertisements.',
        'itemReviewed': {
          '@type': 'Product',
          'name': 'PakBizBranches'
        }
      }
    ]
  }

  // Top cities for internal linking
  const topCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala']

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
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

        {/* SEO Internal Linking Section: Top Business Categories */}
        <section className="py-12 bg-[#f8fafc]" aria-labelledby="browse-by-category-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 id="browse-by-category-heading" className="text-2xl md:text-3xl font-bold text-[#0f2b3d] mb-6">
                Browse by Category — Every Industry, Every City
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 text-left sm:text-center leading-relaxed space-y-4">
                <p>
                  Our business directory Pakistan lists local shops to help you find businesses in Pakistan. Categories cover everything from daily-use services like clinics and restaurants to heavy industries like textile manufacturing and construction. We cover everything from a biryani shop in North Nazimabad to a surgical instruments exporter in Sialkot. Each category page displays verified listings for your city and area.
                </p>
                <p>
                  For daily needs, you can find <Link href="/restaurants/" className="text-emerald-600 hover:underline font-medium">Restaurants and food</Link> next to <Link href="/healthcare/" className="text-emerald-600 hover:underline font-medium">Doctors and clinics</Link>, <Link href="/healthcare/" className="text-emerald-600 hover:underline font-medium">Pharmacies</Link>, and <Link href="/education/" className="text-emerald-600 hover:underline font-medium">Schools and colleges</Link> in Lahore. Professional needs connect <Link href="/finance/" className="text-emerald-600 hover:underline font-medium">Lawyers and legal firms</Link> with <Link href="/real-estate/" className="text-emerald-600 hover:underline font-medium">Real estate and property dealers</Link>, <Link href="/finance/" className="text-emerald-600 hover:underline font-medium">Banks and financial services</Link>, and <Link href="/technology/" className="text-emerald-600 hover:underline font-medium">IT companies and digital agencies</Link> in Karachi to solve local problems. For trade, search <Link href="/construction/" className="text-emerald-600 hover:underline font-medium">Construction and builders</Link> and <Link href="/retail/" className="text-emerald-600 hover:underline font-medium">Textile and garment manufacturers</Link> alongside <Link href="/automotive/" className="text-emerald-600 hover:underline font-medium">Auto workshops and spare parts</Link> and <Link href="/technology/" className="text-emerald-600 hover:underline font-medium">Solar energy installers</Link> in Faisalabad. Finally, lifestyle searches list <Link href="/travel/" className="text-emerald-600 hover:underline font-medium">Wedding halls and catering</Link> alongside <Link href="/travel/" className="text-emerald-600 hover:underline font-medium">Event planners</Link> and <Link href="/logistics/" className="text-emerald-600 hover:underline font-medium">Courier and logistics services</Link> to coordinate local projects.
                </p>
              </div>
            </div>

            {/* The visual category grid with icons links to its respective category page */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
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

            <div className="max-w-4xl mx-auto text-center space-y-4">
              <p className="text-gray-600 font-medium">
                Just search for &apos;solar installer in DHA Karachi&apos; or &apos;auto workshop in Johar Town Lahore&apos; to find active shops in your bilkul wahi area and save time on your next project.
              </p>
              <p className="text-gray-500 text-sm">
                Own a local auto workshop in Rawalpindi? <Link href="/add-business/" className="text-emerald-600 hover:underline font-semibold">Create your free listing today</Link> to start getting calls from customers in your city.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Internal Linking Section: Popular Cities */}
        <section className="py-12 bg-white" aria-labelledby="find-businesses-across-pakistan-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 id="find-businesses-across-pakistan-heading" className="text-2xl md:text-3xl font-bold text-[#0f2b3d] mb-6">
                Find Businesses Across Pakistan — From Karachi&apos;s Clifton to Peshawar&apos;s University Town
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 text-left sm:text-center leading-relaxed space-y-4">
                <p>
                  Our business directory covers every city and town across all four provinces: Punjab, Sindh, KPK, and Balochistan, plus Azad Kashmir and Gilgit-Baltistan. Chahe aap Karachi mein hon ya Peshawar mein, we help you find what you need. You can search by city name, local area or neighborhood, and business category to locate shops nearby.
                </p>
                <p>
                  Karachi lists cover DHA, PECHS, Saddar shops, and Korangi industrial area factories. In Lahore, search Gulberg, Johar Town, Liberty Market, and Anarkali Bazaar. Islamabad covers Blue Area, F-7 Markaz, and G-9 Markaz, while Rawalpindi features Raja Bazaar, Saddar, and Commercial Market. Faisalabad features textile mills on Susan Road, garment factories near D-Ground, and Kohinoor City. Peshawar covers Hayatabad, University Town, and Saddar. Find Quetta&apos;s Jinnah Road and Satellite Town, Multan&apos;s Gulgasht Colony and Bosan Road, Sialkot&apos;s Sambrial sports goods factories and surgical instruments exporters, Gujranwala&apos;s steel industry and ceramics market, and Hyderabad&apos;s Latifabad auto parts market.
                </p>
                <p className="font-semibold text-gray-700">
                  You can click any city name on our map below to browse all verified local businesses listed in that specific region.
                </p>
              </div>
            </div>
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

        {/* SEO Section: What Is PakBizBranches and How Does It Work? */}
        <section className="py-16 bg-[#f8fafc]" aria-labelledby="what-is-pakbizbranches-and-how-does-it-work-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="what-is-pakbizbranches-and-how-does-it-work-heading" className="text-3xl font-bold text-[#0f2b3d] mb-8 text-center">
              What Is PakBizBranches and How Does It Work?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-gray-800">
                PakBizBranches is an online Pakistan business directory that helps local business owners across the country display their contact details and connect with buyers. You pay no fees, need no credit card, and your listing never expires.
              </p>
              <p>
                To start, you sign up with your phone number and add your business details. You enter your business name, city, area, category, WhatsApp number, and photos. Your listing goes live after our team runs a quick verification check. Customers search by city, area, or category to find you easily on our site and on Google. For instance, a tailor in Johar Town Lahore and a car workshop in Saddar Karachi both appear in the same local search.
              </p>
              <p>
                This online visibility matters for your growth because Pakistan now has 48.5 million active internet users according to the PTA in 2024.
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
        {/* How-To Section: How Can I List My Business for Free in Pakistan? */}
        <section className="py-16 bg-white border-t border-gray-100" aria-labelledby="how-to-list-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="how-to-list-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              How Can I List My Business for Free in Pakistan?
            </h2>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <p className="text-lg font-medium text-gray-800 mb-2">
                Listing your business on PakBizBranches is free, takes under 5 minutes, and requires nothing more than your phone number, business details, and a few photos.
              </p>
              <p className="text-gray-600">
                Here is how to list my business online Pakistan and attract local clients, step by step.
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0f2b3d] text-lg mb-2">1. Verify Your Phone Number</h3>
                <p className="text-gray-600 leading-relaxed">
                  Go to PakBizBranches.online and enter your active mobile phone number. Our website sends a quick verification code directly to your phone. You log in immediately without any email or password hassle.
                </p>
              </div>

              <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0f2b3d] text-lg mb-2">2. Enter Your Business Details</h3>
                <p className="text-gray-600 leading-relaxed">
                  Type in your business name, select a category like restaurant or store, and add your city and neighborhood. Then enter your active WhatsApp number, opening hours, and exact shop address so customers can contact you.
                </p>
              </div>

              <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0f2b3d] text-lg mb-2">3. Add Photos and Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Add at least one clear photo of your shop front, office, or products. Write a brief description of your services in English or Roman Urdu. Adding photos gets you three times more customer views.
                </p>
              </div>

              <div className="p-5 bg-[#f8fafc] rounded-xl border border-gray-100">
                <h3 className="font-bold text-[#0f2b3d] text-lg mb-2">4. Go Live and Get Found</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team runs a quick verification check, and then your listing goes live. Customers find you by searching our site and Google. They can call or WhatsApp you directly from your listing page.
                </p>
              </div>
            </div>

            <div className="text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 mb-8 max-w-2xl mx-auto">
              <p className="text-emerald-900 leading-relaxed">
                We offer this free business listing Pakistan service because we want every local shop to grow. You pay nothing now and nothing later, with no hidden upgrades. We help a one-person tailoring shop in Faisalabad and a construction company in Islamabad&apos;s I-8 attract online clients.
              </p>
            </div>

            <div className="text-center flex flex-col items-center gap-4">
              <p className="text-[#0f2b3d] font-semibold text-lg">
                Your local customers are searching right now, so make sure they can find you online today.
              </p>
              <Link
                href="/add-business/"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-base shadow-lg hover:shadow-xl cursor-pointer text-center"
              >
                List My Business Free — Start Now
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & Transparency Section: Is PakBizBranches Really Free? What's the Catch? */}
        <section className="py-16 bg-[#f8fafc] border-t border-b border-gray-100" aria-labelledby="is-free-catch-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="is-free-catch-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Is PakBizBranches Really Free? What&apos;s the Catch?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-gray-800 text-center">
                Listing your business on PakBizBranches is free, does not require a credit card, and has no expiry date or trial period limits.
              </p>
              <p>
                It is fair to ask this question because most directories start free and later force you to pay. We do things differently. We run our site using advertising revenue from paid featured placements instead of charging you. Your basic listing with your phone, city, and photo is free forever. A halal butcher in Gulshan-e-Iqbal Karachi pays nothing to list or stay visible.
              </p>
              <p>
                Pakistan has 5.2 million registered SMEs according to SMEDA, but only 12% have an online presence. With 48.5 million active internet users according to the PTA in 2024, our country cannot afford to have local shops invisible online. We built PakBizBranches so people can find local businesses easily. This is why we help Pakistani shop owners reach customers for free.
              </p>
              <p>
                A free business listing Pakistan profile includes your contact details, photos, category, city, area, WhatsApp button, map pin, and business hours. It is fully functional, not a trial. It is bilkul free, koi lafda nahi. Paid upgrades are optional and only highlight your listing at the top of search results if you want extra exposure.
              </p>
              <p className="text-center font-semibold text-gray-700">
                Thousands of local businesses across Karachi, Lahore, Islamabad, and other cities already use our site to get free customer calls daily.
              </p>
            </div>
          </div>
        </section>

        {/* Consumer Protection Section: How Do I Find a Verified Business in Pakistan? */}
        <section className="py-16 bg-white border-b border-gray-100" aria-labelledby="how-to-find-verified-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="how-to-find-verified-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              How Do I Find a Verified Business in Pakistan?
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-gray-800 text-center">
                You can find a verified business in Pakistan on PakBizBranches, where our team manually checks each listing details before publishing the profile live on our site.
              </p>
              <p>
                Fake online listings, dead phone numbers, and closed stores waste your time and money. For example, if someone in Saddar Rawalpindi searches for a plumber, they might call three numbers from an unverified list. Two are wrong numbers, and one is disconnected. Unverified sources frustrate consumers and hurt honest shop owners.
              </p>
              <p>
                To build a verified business Pakistan profile, we verify each owner&apos;s mobile number via OTP verification. We automatically flag profiles without real shopfront or office photos for manual review, check listed WhatsApp accounts, and run random spot calls. This check is critical for new listings in construction, real estate, and financial services. We also let users report suspicious data easily. Valid listings receive a green Verified Badge on our page.
              </p>
              <p>
                For companies registered with the Securities and Exchange Commission of Pakistan (SECP) or holding an active Federal Board of Revenue (FBR) National Tax Number (NTN), we display their status. An SECP-registered company has a legal identity in Pakistan. An FBR NTN means the business pays taxes. Consumers can cross-check status at secp.gov.pk and fbr.gov.pk.
              </p>
              <p>
                To learn how to find a verified business in Pakistan, look for three signals: the green badge, real photos, and WhatsApp links. If a listing lacks these, call with caution. Ask for their tax number or SECP details before making payments. Always remember: pehle verify karo, phir trust karo.
              </p>
              <p className="text-center font-semibold text-gray-700">
                If a listing feels suspicious, click the report button on the page. Our review team checks every flagged profile within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics & GEO Section: Pakistan Business Stats — Why Your Online Presence Matters Right Now */}
        <section className="py-16 bg-[#f8fafc] border-b border-gray-100" aria-labelledby="pakistan-business-stats-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="pakistan-business-stats-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Pakistan Business Stats — Why Your Online Presence Matters Right Now
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-gray-800 text-center">
                Pakistan has 5.2 million registered small enterprises according to SMEDA, but only 12% have an online presence, leaving a huge opportunity open.
              </p>
              <p>
                According to the Pakistan Telecommunication Authority (PTA), our country has 48.5 million active internet users, with mobile internet accounting for 78% of all web traffic. This user base grew by 9% between 2023 and 2024. Over 60% of consumers search online before visiting a Faisalabad shop or a clinic in Peshawar&apos;s Hayatabad. This means your next local client is searching for you on their phone right now.
              </p>
              <p>
                The Small and Medium Enterprises Development Authority (SMEDA) reports that Pakistan has 5.2 million registered SMEs contributing approximately 40% of our GDP. These businesses employ over 80% of the non-agricultural workforce according to the World Bank. However, the vast majority operates with no website or verified online listing. This leaves the main engine of our economy invisible to local buyers searching online.
              </p>
              <p>
                According to Google Trends Pakistan data, local &apos;near me&apos; searches grew by over 200% between 2020 and 2024. Mobile searches spike at night between 8pm and 11pm, and during wedding or festival seasons. This means your customers are searching for you on their phone at night, using voice search in English or Roman Urdu.
              </p>
              <p className="text-center font-semibold text-[#0f2b3d]">
                PakBizBranches helps put Pakistani businesses online to close this massive gap, building a verified online presence Pakistan for every single shop.
              </p>
            </div>
          </div>
        </section>

        {/* Competitor Comparison Section: Why Pakistani Businesses Choose PakBizBranches Over Other Directories */}
        <section className="py-16 bg-white border-b border-gray-100" aria-labelledby="compare-directories-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="compare-directories-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Why Pakistani Businesses Choose PakBizBranches Over Other Directories
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed mb-8">
              <p className="text-lg font-medium text-gray-800 text-center">
                Pakistani business owners need three main things from a directory. They want local customers to find them, they need direct contact through WhatsApp, and they refuse to pay monthly fees just to remain visible. Many listing platforms make big claims but fail to deliver these basic business tools.
              </p>
              <p className="text-center text-gray-500">
                Here is how PakBizBranches compares to other major Pakistani business directories on the features that matter most.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto mb-8 border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-[#f8fafc] text-gray-700 font-semibold">
                  <tr>
                    <th className="px-6 py-3 border-b">Feature</th>
                    <th className="px-6 py-3 border-b bg-[#f0fdf4] text-emerald-800">PakBizBranches</th>
                    <th className="px-6 py-3 border-b">BusinessList.pk</th>
                    <th className="px-6 py-3 border-b">Enic.pk</th>
                    <th className="px-6 py-3 border-b">BusinessBook.pk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Free Basic Listing</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - always free</td>
                    <td className="px-6 py-4">No - starts at $24 USD one-time</td>
                    <td className="px-6 py-4">No - 1,000 PKR one-time fee</td>
                    <td className="px-6 py-4">No - paid plans only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">WhatsApp Contact Button</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - on every listing</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">Yes</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Urdu / Roman Urdu Support</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - descriptions in Urdu or Roman Urdu</td>
                    <td className="px-6 py-4">No - English only</td>
                    <td className="px-6 py-4">Partial</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Hyperlocal Area Search</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - search by neighborhood/area</td>
                    <td className="px-6 py-4">City level only</td>
                    <td className="px-6 py-4">City level only</td>
                    <td className="px-6 py-4">City level only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Verified Badge System</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - OTP + photo + WhatsApp check</td>
                    <td className="px-6 py-4">Yes - human verified</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Mobile-First Design</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - built for smartphone users</td>
                    <td className="px-6 py-4">Partial</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">Fake Listing Report System</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - report button on every listing</td>
                    <td className="px-6 py-4">No visible system</td>
                    <td className="px-6 py-4">No visible system</td>
                    <td className="px-6 py-4">No visible system</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-[#0f2b3d]">SECP / FBR Registration Display</td>
                    <td className="px-6 py-4 bg-[#f0fdf4] text-emerald-800 font-semibold">Yes - optional on listing page</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                    <td className="px-6 py-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>
                This data shows that PakBizBranches offers the best business directory Pakistan option for local growth. The biggest difference is cost, because we provide free listings while others charge in USD or PKR. We also fit local needs better, offering WhatsApp contact, Roman Urdu support, and neighborhood search. Create your free business listing today to see the difference yourself.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section: Who Lists on PakBizBranches? Real Pakistani Businesses, Real Results */}
        <section className="py-16 bg-[#f8fafc] border-b border-gray-100" aria-labelledby="testimonials-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-[#0f2b3d] mb-6 text-center">
              Who Lists on PakBizBranches? Real Pakistani Businesses, Real Results
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              PakBizBranches actively serves local business owners across every single category and every province in Pakistan. Our database hosts all kinds of listings, from small street level shops to large registered manufacturing companies in industrial areas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    <span className="text-xs font-semibold text-gray-500 mr-1">5 out of 5 stars</span>
                    <span>★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;I listed my auto spare parts shop here and felt surprised when customers actually called. Within the first month, I got 4 to 6 new customer calls per week. They specifically told me they found my shop on this directory. Yeh service sach mein kaam ayi.&rdquo;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="font-bold text-[#0f2b3d] text-sm">Muhammad Usman Butt</h4>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Auto Spare Parts</p>
                  <p className="text-xs text-gray-400">Raja Bazaar, Rawalpindi</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    <span className="text-xs font-semibold text-gray-500 mr-1">5 out of 5 stars</span>
                    <span>★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;Before listing on this directory, my home catering service had no online presence. I did not expect a free platform to work, but I got my first three orders from outside my friend circle within two weeks. I appreciate how this site helps small home businesses grow.&rdquo;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="font-bold text-[#0f2b3d] text-sm">Sana Fatima</h4>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Home Catering</p>
                  <p className="text-xs text-gray-400">Gulberg III, Lahore</p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    <span className="text-xs font-semibold text-gray-500 mr-1">4 out of 5 stars</span>
                    <span>★★★★☆</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;The WhatsApp contact button on my listing is now my primary source for new business inquiries. I get 8 to 12 WhatsApp messages every week from potential clients in Karachi. This free listing saved my solar company from paying for expensive online advertisements.&rdquo;
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="font-bold text-[#0f2b3d] text-sm">Farhan Ahmed Siddiqui</h4>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Solar Installation</p>
                  <p className="text-xs text-gray-400">PECHS Block 6, Karachi</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-600 font-medium text-sm">
                Active Pakistani business owners give our portal a high rating of 4.8 out of 5 based on verified listing reviews.
              </p>
              <p className="text-[#0f2b3d] font-semibold text-base">
                Join thousands of active Pakistani business owners who attract new local customers by listing your own company completely free today.
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
