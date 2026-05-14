import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2, Globe, Facebook, Youtube, ExternalLink, ChevronRight, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES, CITIES } from '@/lib/data'
import { LIVE_STATUSES, getPossibleCategoryValues } from '@/lib/category-mappings'
import { generateCategoryContent, generateCityContent } from '@/lib/seo-content'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
import BannerAd from '@/components/ads/banner-ad'
import NativeAd from '@/components/ads/native-ad'
import React from 'react'

// Disable caching so new/updated business data appears immediately
export const revalidate = 60
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://pakbizbranhces.online'

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  subCategory?: string
  description: string
  logoUrl?: string
  websiteUrl?: string
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  createdAt: any
  status: string
  slug: string
}

function findCityBySlug(slug: string): string | null {
  const normalized = slug.replace(/-/g, ' ').toLowerCase()
  return CITIES.find(c => c.toLowerCase() === normalized) ?? null
}

function findCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.id === slug) ?? null
}

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('slug', '==', slug),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Business
  } catch {
    return null
  }
}

async function getSimilarBusinesses(city: string, category: string, excludeSlug: string): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('city', '==', city),
      where('category', '==', category),
      limit(5)
    )
    const snap = await getDocs(q)
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Business))
      .filter(b => {
        const status = String((b as any).status ?? '').toLowerCase()
        return (!status || LIVE_STATUSES.has(status)) && b.slug !== excludeSlug
      })
      .slice(0, 4)
  } catch {
    return []
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params

  // Check if it's a City
  const cityName = findCityBySlug(slug)
  if (cityName) {
    const title = `${cityName} Business Directory 2026 | Verified Local Businesses & Services`
    const description = `Find verified local businesses in ${cityName} — restaurants, clinics, real estate, technology, beauty salons & more. Browse direct phone numbers and addresses. Pakistan's trusted free directory.`
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCityKeywordCluster(cityName)

    return {
      title,
      description,
      keywords: [`${cityName} business directory`, `businesses in ${cityName}`, `${cityName} local services`, ...keywordCluster],
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // Check if it's a Category
  const category = findCategoryBySlug(slug)
  if (category) {
    const title = `Best ${category.name} in Pakistan 2026 | Verified Listings & Phone Numbers`
    const description = `Browse verified ${category.name.toLowerCase()} businesses across Karachi, Lahore, Islamabad & 150+ Pakistani cities. Get direct phone numbers and addresses — free on PakBizBranches.`
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCategoryKeywordCluster(slug)

    return {
      title,
      description,
      keywords: [`${category.name} in Pakistan`, `best ${category.name.toLowerCase()} Pakistan`, ...keywordCluster],
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // Business Detail
  const business = await getBusinessBySlug(slug)
  if (!business) {
    return {
      title: 'Business Not Found | PakBizBranches',
      description: 'The business you are looking for could not be found.',
    }
  }

  const businessCategory = CATEGORIES.find(c => c.id === business.category)
  const categoryName = businessCategory?.name ?? business.category
  const title = `${business.businessName} ${business.city} | Verified Phone, Address & Contact`
  const description = `${business.businessName} is a verified ${categoryName} business in ${business.city}, Pakistan. Get direct phone number (${business.phone}), address, WhatsApp & full contact details — free on PakBizBranches.`
  const url = `${BASE_URL}/${slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
  }
}

export default async function CatchAllPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  // 1. City View
  const cityName = findCityBySlug(slug)
  if (cityName) {
    let businesses: Business[] = []
    try {
      const q = query(collection(db, 'businesses'), where('city', '==', cityName), limit(40))
      const snap = await getDocs(q)
      businesses = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as Business))
        .filter(b => {
          const status = String((b as any).status ?? '').toLowerCase()
          return !status || LIVE_STATUSES.has(status)
        })
    } catch {}

    const content = generateCityContent(cityName)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: cityName, item: `${BASE_URL}/${slug}` },
      ],
    }

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <main className="bg-[#f8fafc] min-h-screen">
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-[#60a5fa]" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">Businesses in {cityName}</h1>
              </div>
              <p className="text-xl text-white/80 max-w-2xl">Discover top-rated local businesses in {cityName}.</p>
            </div>
          </section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map(biz => (
                <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                   <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{biz.businessName}</h3>
                   <p className="text-sm text-gray-500">{biz.phone}</p>
                </Link>
              ))}
            </div>
            <div className="mt-12 prose prose-blue max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 2. Category View
  const category = findCategoryBySlug(slug)
  if (category) {
    let businesses: Business[] = []
    try {
      const categoryValues = getPossibleCategoryValues(slug).slice(0, 5)
      const primaryQuery = query(collection(db, 'businesses'), where('categoryId', '==', slug), limit(60))
      const fallbackQuery = query(collection(db, 'businesses'), where('category', 'in', categoryValues), limit(60))
      const [pSnap, fSnap] = await Promise.all([getDocs(primaryQuery), getDocs(fallbackQuery)])
      const merged = new Map<string, Business>()
      pSnap.docs.forEach(doc => merged.set(doc.id, { id: doc.id, ...doc.data() } as Business))
      fSnap.docs.forEach(doc => { if (!merged.has(doc.id)) merged.set(doc.id, { id: doc.id, ...doc.data() } as Business) })
      businesses = Array.from(merged.values()).filter(b => {
        const status = String((b as any).status ?? '').toLowerCase()
        return !status || LIVE_STATUSES.has(status)
      }).slice(0, 40)
    } catch {}

    const content = generateCategoryContent(slug)
    return (
      <>
        <Navbar />
        <main className="bg-[#f8fafc] min-h-screen">
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name} in Pakistan</h1>
              <p className="text-xl text-white/80">Browse verified {category.name.toLowerCase()} businesses across Pakistan.</p>
            </div>
          </section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map(biz => (
                <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                   <h3 className="font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{biz.businessName}</h3>
                   <p className="text-sm text-gray-500">{biz.city}</p>
                </Link>
              ))}
            </div>
            <div className="mt-12 prose prose-blue max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 3. Business Detail View
  const business = await getBusinessBySlug(slug)
  if (!business) notFound()

  const businessCategory = CATEGORIES.find(c => c.id === business.category)
  const categoryName = businessCategory?.name ?? business.category
  const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null
  const similarBusinesses = await getSimilarBusinesses(business.city, business.category, slug)
  const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, Pakistan`)
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
  const pageUrl = `${BASE_URL}/${slug}/`
  const categoryUrl = `/${business.category}/`
  const cityUrl = `/${encodeURIComponent(business.city.toLowerCase().replace(/ /g, '-'))}/`

  const sameAs: string[] = []
  if (business.websiteUrl) sameAs.push(business.websiteUrl)
  if (business.facebookPage) sameAs.push(business.facebookPage)
  if (business.youtubeChannel) sameAs.push(business.youtubeChannel)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': pageUrl,
    name: business.businessName,
    description: business.description,
    url: pageUrl,
    telephone: business.phone,
    priceRange: '$$',
    ...(business.email && { email: business.email }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.city,
      addressCountry: 'PK',
    },
    areaServed: { '@type': 'City', name: business.city },
    ...(businessCategory && { knowsAbout: businessCategory.name }),
    ...(business.logoUrl && { image: business.logoUrl, logo: business.logoUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${BASE_URL}${categoryUrl}` },
      { '@type': 'ListItem', position: 3, name: business.businessName, item: pageUrl },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Where is ${business.businessName} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${business.businessName} is located at ${business.address}, ${business.city}, Pakistan.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the contact number for ${business.businessName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can contact ${business.businessName} at ${business.phone}.`,
        },
      },
    ],
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={categoryUrl} className="hover:text-[#60a5fa] transition-colors">{categoryName}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-800 font-medium truncate">{business.businessName}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.businessName} className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm" loading="lazy" />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center border border-gray-200">
                    <Building2 className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">{business.businessName} {business.city}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-6">
                  <Link href={categoryUrl} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                    {categoryName}
                  </Link>
                  <Link href={cityUrl} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    {business.city}
                  </Link>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{business.description}</p>
                <div className="flex flex-wrap gap-4">
                  <a href={`tel:${business.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold hover:bg-[#1a3f57] transition-colors shadow-sm">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  {whatsappUrl && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 prose prose-blue max-w-none">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">About {business.businessName}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{business.description}</p>
                  
                  <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Professional Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {business.businessName} is a verified <strong>{categoryName}</strong> business serving the <strong>{business.city}</strong> area. 
                    Located at {business.address}, they are committed to providing quality services to their customers.
                  </p>

                  <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Contact Information</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>Address:</strong> {business.address}, {business.city}, Pakistan</li>
                    <li><strong>Phone:</strong> <a href={`tel:${business.phone}`}>{business.phone}</a></li>
                    {business.whatsapp && <li><strong>WhatsApp:</strong> {business.whatsapp}</li>}
                    {business.email && <li><strong>Email:</strong> {business.email}</li>}
                  </ul>
                </div>

                {/* Similar Businesses */}
                {similarBusinesses.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#0f2b3d]">Similar Businesses in {business.city}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {similarBusinesses.map(biz => (
                        <Link key={biz.id} href={`/${biz.slug}/`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center gap-4 group">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                            <Building2 className="w-6 h-6 text-gray-400 group-hover:text-[#60a5fa]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{biz.businessName}</span>
                            <span className="block text-sm text-gray-500">{biz.phone}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#60a5fa]" /> Location
                  </h3>
                  <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
                    <iframe src={mapSrc} width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map Location" />
                  </div>
                  <p className="text-sm text-gray-600">{business.address}, {business.city}, Pakistan</p>
                </div>

                <div className="bg-[#0f2b3d] rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-2">Claim this listing?</h3>
                  <p className="text-sm text-white/70 mb-4">Is this your business? Contact us to verify and enhance your listing.</p>
                  <Link href="/contact" className="block text-center py-2.5 bg-[#60a5fa] text-white rounded-xl text-sm font-bold hover:bg-blue-400 transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

