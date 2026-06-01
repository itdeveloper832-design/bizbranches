import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Building2, Phone, ArrowRight, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CITIES, CATEGORIES } from '@/lib/data'
import { generateCityCategoryContent } from '@/lib/seo-content'
import { fetchCityCategoryBusinesses, Business } from '@/lib/firebase-server'

// ISR: revalidate every 60 seconds
export const revalidate = 60

const BASE_URL = 'https://www.pakbizbranhces.online'

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

export async function generateMetadata(props: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = findCategoryBySlug(params.category)
  
  if (!cityName || !category) return { title: 'Not Found: PakBizBranches' }

  // Query database dynamically to determine quality threshold
  const businesses = await fetchCityCategoryBusinesses(cityName, category.id, 5)
  const isThinContent = businesses.length < 5

  // Build title: 50-60 chars, no pipes
  let title = `${category.name} in ${cityName}: Verified Phone Numbers`
  if (title.length > 60) title = `${category.name} in ${cityName}: Contacts`
  if (title.length > 60) title = title.substring(0, 60)
  if (title.length < 50) title = `Find ${category.name} in ${cityName}: Verified Contacts`
  if (title.length > 60) title = title.substring(0, 60)

  // Build description: 140-155 chars
  let description = `Browse verified ${category.name.toLowerCase()} businesses in ${cityName}. Get direct phone numbers, WhatsApp links, and exact addresses free on PakBizBranches.`
  if (description.length > 155) description = description.substring(0, 152) + '...'
  if (description.length < 140) {
    description = `Find the best ${category.name.toLowerCase()} in ${cityName}, Pakistan. Get verified phone numbers, WhatsApp contacts, and addresses free on PakBizBranches.`
    if (description.length > 155) description = description.substring(0, 152) + '...'
  }

  const url = `${BASE_URL}/${params.city}/${params.category}/`

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${cityName}`,
      `best ${category.name} ${cityName}`,
      `${cityName} ${category.name} directory`,
      `${category.name} contact numbers ${cityName}`,
      `${cityName} businesses`,
    ],
    alternates: { canonical: url },
    robots: {
      index: !isThinContent, // prevent Google penalty for thin dynamic combination hubs
      follow: true,
    },
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

export default async function CityCategoryPage(props: { params: Promise<{ city: string; category: string }> }) {
  const params = await props.params;
  const cityName = findCityBySlug(params.city)
  const category = findCategoryBySlug(params.category)
  
  if (!cityName || !category) notFound()

  const businesses = await fetchCityCategoryBusinesses(cityName, category.id, 40)
  const content = generateCityCategoryContent(cityName, category.id)
  const pageUrl = `${BASE_URL}/${params.city}/${params.category}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: cityName, item: `${BASE_URL}/${params.city}/` },
      { '@type': 'ListItem', position: 3, name: category.name, item: pageUrl },
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the best ${category.name.toLowerCase()} in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can find the top ${category.name.toLowerCase()} in ${cityName} on PakBizBranches. Browse verified listings with direct phone numbers, WhatsApp contacts, and addresses.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I contact ${category.name.toLowerCase()} businesses in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Each listing on PakBizBranches includes direct phone numbers, WhatsApp contacts, and addresses for ${category.name.toLowerCase()} businesses in ${cityName}. Click any listing to view full contact details.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I add my ${category.name.toLowerCase()} business in ${cityName} for free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! You can list your ${category.name.toLowerCase()} business in ${cityName} for free on PakBizBranches. No registration or payment required.`,
        },
      },
    ],
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${params.city}/`} className="hover:text-white transition-colors">{cityName}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-[#60a5fa]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {businesses.length > 0 ? `${businesses.length}+ ` : ''}{category.name} in {cityName} – Verified Contacts & Reviews
              </h1>
            </div>
            <p className="text-xl text-white/80 max-w-2xl">
              Verified {category.name.toLowerCase()} businesses and services in {cityName}, Pakistan. Find contact details and locations instantly.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Business Listings */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <h2 className="text-2xl font-bold text-[#0f2b3d]">
                Top Rated {category.name}
                <span className="text-base font-normal text-gray-500 ml-3">({businesses.length} verified listings)</span>
              </h2>
              <Link href="/add-business" className="inline-flex items-center gap-2 text-[#60a5fa] font-semibold hover:underline">
                Add Your Business
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {businesses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Found</h3>
                <p className="text-gray-500 mb-6">Be the first to list a {category.name.toLowerCase()} business in {cityName}!</p>
                <Link href="/add-business" className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors">
                  List Business Free
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {businesses.map(biz => (
                  <Link
                    key={biz.id}
                    href={`/${biz.slug}/`}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#60a5fa]/30 transition-all group flex gap-5"
                  >
                    {biz.logoUrl ? (
                      <img src={biz.logoUrl} alt={biz.businessName} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center shrink-0">
                        <Building2 className="w-10 h-10 text-white/60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#60a5fa] transition-colors mb-1 truncate">
                        {biz.businessName}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityName}, Pakistan
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {biz.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0f2b3d]">
                          <Phone className="w-4 h-4 text-[#60a5fa]" />
                          {biz.phone}
                        </div>
                        <span className="text-xs text-[#60a5fa] font-bold group-hover:translate-x-1 transition-transform">View Details →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* SEO Content Block */}
          <section className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 prose prose-blue max-w-none">
             {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold text-[#0f2b3d] mt-8 mb-6">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-[#0f2b3d] mt-6 mb-4">{line.replace('### ', '')}</h3>
              if (line.trim() === '') return null
              return <p key={i} className="text-gray-600 leading-relaxed text-lg mb-4">{line}</p>
            })}
            
            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-xl font-bold text-[#0f2b3d] mb-6">Other Popular Categories in {cityName}</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c.id !== category.id).slice(0, 8).map(cat => (
                  <Link
                    key={cat.id}
                    href={`/${params.city}/${cat.id}/`}
                    className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-[#60a5fa] transition-colors border border-gray-100"
                  >
                    {cat.name} in {cityName}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
