import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Building2, Phone, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CITIES, CATEGORIES } from '@/lib/data'
import { generateCityContent } from '@/lib/seo-content'
import { getCityKeywordCluster } from '@/lib/organic-keywords'
import { LIVE_STATUSES } from '@/lib/category-mappings'

// ISR: revalidate every 60 seconds
export const revalidate = 60

const BASE_URL = 'https://www.pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  slug: string
  city: string
  category: string
  description: string
  phone: string
  address: string
  logoUrl?: string
}


function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  if (!cityName) return { title: 'City Not Found: PakBizBranches Directory' }

  let businessesCount = 0
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', cityName),
      limit(3)
    )
    const snap = await getDocs(q)
    businessesCount = snap.size
  } catch {}

  // Title: 50-60 chars, no pipes or dashes
  let title = `${cityName} Business Directory: Find Local Companies`
  if (title.length < 50) {
    title = `${cityName} Business Directory: Find Verified Local Companies`
  }
  if (title.length > 60) {
    title = title.substring(0, 60)
  }

  // Description: 140-155 chars
  let description = `Search verified local businesses in ${cityName}. Find phone numbers, WhatsApp contacts, and physical addresses on the PakBizBranches directory free.`
  if (description.length < 140) {
    description = `Search verified local businesses in ${cityName}. Find direct phone numbers, WhatsApp contacts, and physical addresses on the PakBizBranches directory free.`
  }
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  }

  const url = `${BASE_URL}/cities/${params.city}/`
  const keywordCluster = getCityKeywordCluster(cityName)

  return {
    title,
    description,
    keywords: [
      `${cityName} business directory`,
      `businesses in ${cityName}`,
      `${cityName} local businesses`,
      `restaurants in ${cityName}`,
      `clinics in ${cityName}`,
      `real estate ${cityName}`,
      ...keywordCluster,
    ],
    robots: {
      index: businessesCount >= 3,
      follow: true,
    },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function CityPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  if (!cityName) notFound()

  let businesses: Business[] = []
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', cityName),
      limit(40)
    )
    const snap = await getDocs(q)
    businesses = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Business))
      .filter(b => {
        const status = String((b as any).status ?? '').toLowerCase()
        return !status || LIVE_STATUSES.has(status)
      })
  } catch {}

  const content = generateCityContent(cityName)
  const pageUrl = `${BASE_URL}/cities/${params.city}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE_URL}/cities` },
      { '@type': 'ListItem', position: 3, name: cityName, item: pageUrl },
    ],
  }

  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Businesses in ${cityName}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.businessName,
      url: `${BASE_URL}/business/${b.slug}/`,
    })),
  } : null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I find businesses in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Browse the ${cityName} business directory on PakBizBranches. Filter by category to find restaurants, clinics, real estate agents, technology companies, and more in ${cityName}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I list my business in ${cityName} for free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! You can add your ${cityName} business to PakBizBranches for free. No registration or payment required. Your listing will appear in city and category search results.`,
        },
      },
      {
        '@type': 'Question',
        name: `What types of businesses are listed in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `PakBizBranches lists all types of businesses in ${cityName} including restaurants, real estate, healthcare, technology, education, retail, automotive, finance, beauty, logistics, and construction.`,
        },
      },
    ],
  }

  const localBusinessSchemas = businesses.map(b => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.businessName,
    url: `${BASE_URL}/business/${b.slug}/`,
    telephone: b.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: b.city,
      addressCountry: 'PK'
    },
    image: b.logoUrl || undefined,
    description: b.description
  }))

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {localBusinessSchemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white/80">Cities</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{cityName}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-[#60a5fa]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Businesses in {cityName}
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl">
              Discover top-rated local businesses in {cityName}. Browse by category or find exactly what you need.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">{businesses.length}+ Listings</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">Free to Browse</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Intro Paragraph */}
          {businesses.length > 0 && (
            <section className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                Welcome to the local business directory for <strong>{cityName}</strong>. Whether you are a resident or a visitor, finding trusted services is essential. Browse our comprehensive list of {businesses.length} verified companies, professionals, and shops operating right here in {cityName}. From real estate to technology, you can easily compare local options, get contact numbers, and find exactly what you need in your area.
              </p>
            </section>
          )}

          {/* Browse by Category */}
          {businesses.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Browse by Category in {cityName}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {CATEGORIES.filter(cat => businesses.some(b => b.category === cat.id)).map(cat => (
                  <Link
                    key={cat.id}
                    href={`/locations/${params.city}/${cat.id}`}
                    className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Building2 className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <p className="text-xs font-medium text-gray-700 group-hover:text-[#60a5fa] leading-tight transition-colors">
                      {cat.name}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Business Listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
              All Businesses in {cityName}
              <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} listings)</span>
            </h2>

            {businesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to list your business in {cityName}!</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  Add Your Business Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {businesses.map(biz => {
                  const category = CATEGORIES.find(c => c.id === biz.category)
                  return (
                    <Link
                      key={biz.id}
                      href={`/business/${biz.slug}/`}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group flex flex-col"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {biz.logoUrl ? (
                          <img src={biz.logoUrl} alt={biz.businessName} className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0" loading="lazy" />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center shrink-0">
                            <Building2 className="w-7 h-7 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] transition-colors leading-tight mb-1 truncate">
                            {biz.businessName}
                          </h3>
                          {category && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#60a5fa] font-medium">
                              {category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
                        {biz.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {biz.phone}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {businesses.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Add Your Business in {cityName} - Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* SEO Content */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-gray max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-[#0f2b3d]">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-[#0f2b3d]">{line.replace('### ', '')}</h3>
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="text-gray-600 leading-relaxed">{line}</p>
            })}

            {/* Popular Searches: city+category cross-links */}
            {businesses.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-[#0f2b3d] mb-4">Popular Searches in {cityName}</h2>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(cat => businesses.some(b => b.category === cat.id)).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/locations/${params.city}/${cat.id}/`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      {cat.name} in {cityName}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Architecture Linking */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
              <span className="text-gray-400">Related:</span>
              <Link href="/" className="text-[#60a5fa] hover:underline" title="Pakistan Business Directory">Directory Home</Link>
              <Link href="/categories/" className="text-[#60a5fa] hover:underline" title="Browse Categories">Browse All Categories</Link>
              <Link href="/add-business/" className="text-[#60a5fa] hover:underline" title="Add Your Business Free">Add Business Free</Link>
              <Link href="/blog/" className="text-[#60a5fa] hover:underline" title="Business Blog">Business Blog</Link>
              <Link href="/contact/" className="text-[#60a5fa] hover:underline" title="Contact Us">Contact Us</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export const runtime = 'edge';

