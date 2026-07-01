import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building2, Phone, ArrowRight, ChevronRight, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CITIES, CATEGORIES } from '@/lib/data'
import { generateCityCategoryContent } from '@/lib/seo-content'
import { getPossibleCategoryValues, LIVE_STATUSES } from '@/lib/category-mappings'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'

const BASE_URL = 'https://www.pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  slug: string
  city: string
  category: string
  description: string
  phone: string
  logoUrl?: string
}

// ISR: revalidate every 60 seconds
export const revalidate = 60

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; categorySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!cityName || !category) return { title: 'Not Found: PakBizBranches' }

  let title = `Best ${category.name} in ${cityName} 2026: Phone and Contact Details`
  if (title.length > 60) {
    title = `Best ${category.name} in ${cityName} 2026: Verified Contact`
  }
  if (title.length > 60) {
    title = `Top ${category.name} in ${cityName}: Phone Numbers`
  }
  if (title.length < 50) {
    title = `Find Best ${category.name} in ${cityName} 2026: Contact Details`
  }
  if (title.length > 60) {
    title = title.substring(0, 60)
  }

  let description = `Find the best ${category.name.toLowerCase()} in ${cityName} with direct phone numbers, WhatsApp contacts, local addresses, and verified listings. Updated 2026.`
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  } else if (description.length < 140) {
    description = `Find the best ${category.name.toLowerCase()} in ${cityName} with direct phone numbers, WhatsApp contacts, local addresses, and verified listings free.`
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
  }

  const url = `${BASE_URL}/locations/${params.city}/${params.categorySlug}/`
  const keywordCluster = [
    ...getCategoryKeywordCluster(params.categorySlug),
    ...getCityKeywordCluster(cityName),
  ]

  let businessesCount = 0
  try {
    const categoryValues = getPossibleCategoryValues(params.categorySlug).slice(0, 10)
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', cityName),
      where('category', 'in', categoryValues),
      limit(3)
    )
    const snap = await getDocs(q)
    businessesCount = snap.size
  } catch {}

  return {
    title,
    description,
    keywords: [
      `${category.name} ${cityName}`,
      `best ${category.name.toLowerCase()} in ${cityName}`,
      `${cityName} ${category.name.toLowerCase()} businesses`,
      ...keywordCluster.slice(0, 8),
    ],
    robots: {
      index: businessesCount >= 1,
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

export default async function CityCategoryPage(props: { params: Promise<{ city: string; categorySlug: string }> }) {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = CATEGORIES.find(c => c.id === params.categorySlug)
  if (!cityName || !category) notFound()

  let businesses: Business[] = []
  try {
    const categoryValues = getPossibleCategoryValues(params.categorySlug).slice(0, 10)
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', cityName),
      where('category', 'in', categoryValues),
      limit(60)
    )
    const snap = await getDocs(q)
    businesses = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Business))
      .filter((business) => {
        const status = String((business as any).status ?? '').toLowerCase()
        return !status || LIVE_STATUSES.has(status)
      })
      .slice(0, 40)
  } catch {}

  const content = generateCityCategoryContent(cityName, params.categorySlug)
  const pageUrl = `${BASE_URL}/locations/${params.city}/${params.categorySlug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: category.name, item: `${BASE_URL}/categories/${params.categorySlug}/` },
      { '@type': 'ListItem', position: 3, name: cityName, item: pageUrl },
    ],
  }

  const itemListSchema = businesses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} in ${cityName}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.slice(0, 10).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.businessName,
      url: `${BASE_URL}/${b.slug}/`,
    })),
  } : null

  const faqItems = [
    {
      q: `What are the best ${category.name.toLowerCase()} in ${cityName}?`,
      a: `You can compare top ${category.name.toLowerCase()} listings in ${cityName} by phone number, location, and service details on this page.`,
    },
    {
      q: `How can I contact ${category.name.toLowerCase()} businesses in ${cityName}?`,
      a: 'Open any listing to find direct phone, WhatsApp, address, and business profile details.',
    },
    {
      q: `Can I add my business to this ${cityName} list?`,
      a: 'Yes. Submit your listing for free to appear in relevant category and city pages.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const localBusinessSchemas = businesses.map(b => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.businessName,
    url: `${BASE_URL}/${b.slug}/`,
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
              <Link href={`/categories/${params.categorySlug}/`} className="hover:text-white transition-colors">{category.name}</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/cities/${params.city}/`} className="hover:text-white transition-colors">{cityName}</Link>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name} in {cityName}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Find the best {category.name.toLowerCase()} businesses in {cityName}, Pakistan. Verified listings with contact details.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">{businesses.length}+ Listings</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">{cityName}</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Related Pages Nav */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Link href={`/cities/${params.city}/`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors shadow-sm">
                <MapPin className="w-3.5 h-3.5" /> All businesses in {cityName}
              </Link>
              <Link href={`/categories/${params.categorySlug}/`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors shadow-sm">
                <Building2 className="w-3.5 h-3.5" /> All {category.name} in Pakistan
              </Link>
            </div>
          </section>

          {/* Intro Paragraph */}
          {businesses.length > 0 && (
            <section className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                Looking for reliable <strong>{category.name.toLowerCase()} in {cityName}</strong>? Our comprehensive directory features top-rated professionals and companies serving the {cityName} area. Whether you need immediate assistance or are planning a project, browse our curated list of {businesses.length} verified {category.name.toLowerCase()} services. Compare local options, read contact details, and connect directly with businesses in {cityName} to find the perfect fit for your needs.
              </p>
            </section>
          )}

          {/* Business Listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
              {category.name} Businesses in {cityName}
              <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} listings)</span>
            </h2>

            {businesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
                <p className="text-gray-500 mb-6">
                  Be the first to list your {category.name.toLowerCase()} business in {cityName}!
                </p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  Add Your Business Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {businesses.map(biz => (
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
                        <span className="text-xs flex items-center gap-1 text-gray-500">
                          <MapPin className="w-3 h-3" /> {biz.city}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">{biz.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="w-3.5 h-3.5" />
                      {biz.phone}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {businesses.length > 0 && (
              <div className="mt-6 text-center">
                <Link href="/add-business/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Add Your {category.name} Business in {cityName} - Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </section>

          {/* Other Popular Cities */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#0f2b3d] mb-4">Explore Other Cities</h2>
            <div className="flex flex-wrap gap-3">
              {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Hyderabad']
                .filter(c => c !== cityName)
                .map(city => (
                <Link
                  key={city}
                  href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/${params.categorySlug}/`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {category.name} in {city}
                </Link>
              ))}
            </div>
          </section>

          {/* SEO Content */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-[#0f2b3d] mt-4 mb-3">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-[#0f2b3d] mt-3 mb-2">{line.replace('### ', '')}</h3>
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                if (match) return <p key={i} className="text-gray-600 leading-relaxed mb-2"><strong>{match[1]}:</strong> {match[2]}</p>
              }
              if (line.trim() === '') return <br key={i} />
              return <p key={i} className="text-gray-600 leading-relaxed mb-2">{line}</p>
            })}

            {/* Internal Architecture Linking */}
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
              <span className="text-gray-400">Related:</span>
              <Link href="/" className="text-[#60a5fa] hover:underline" title="Pakistan Business Directory">Directory Home</Link>
              <Link href={`/cities/${params.city}/`} className="text-[#60a5fa] hover:underline" title={`Businesses in ${cityName}`}>All {cityName} Businesses</Link>
              <Link href={`/categories/${params.categorySlug}/`} className="text-[#60a5fa] hover:underline" title={`${category.name} in Pakistan`}>All {category.name}</Link>
              <Link href="/add-business/" className="text-[#60a5fa] hover:underline" title="Add Business Free">Add Business Free</Link>
              <Link href="/blog/" className="text-[#60a5fa] hover:underline" title="Business Blog">Business Blog</Link>
            </div>
          </section>

          <section className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-4">FAQs for {category.name} in {cityName}</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-gray-900">{item.q}</h3>
                  <p className="text-gray-600 mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export const runtime = 'edge';
