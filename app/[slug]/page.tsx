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
    const title = `${cityName} Business Directory | Local Businesses & Services`
    const description = `Find verified local businesses in ${cityName} — restaurants, clinics, real estate, technology, beauty salons & more. Browse phone numbers and addresses on Pakistan's #1 free business directory.`
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCityKeywordCluster(cityName)

    return {
      title,
      description,
      keywords: [`${cityName} business directory`, `businesses in ${cityName}`, ...keywordCluster],
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // Check if it's a Category
  const category = findCategoryBySlug(slug)
  if (category) {
    const title = `Best ${category.name} in Pakistan | Find Phone Numbers & Addresses`
    const description = `Browse verified ${category.name.toLowerCase()} businesses across Karachi, Lahore, Islamabad & 150+ Pakistani cities. Get phone numbers and addresses free on PakBizBranches.`
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCategoryKeywordCluster(slug)

    return {
      title,
      description,
      keywords: [`${category.name} in Pakistan`, ...keywordCluster],
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
  const title = `${business.businessName} ${business.city} – Official Details & Contact Information`
  const description = `${business.businessName} is a verified ${categoryName} business located at ${business.address}, ${business.city}, Pakistan. Get contact number (${business.phone}), address, and more.`
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
                <Link key={biz.id} href={`/${biz.slug}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
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
                <Link key={biz.id} href={`/${biz.slug}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
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
  const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null
  const similarBusinesses = await getSimilarBusinesses(business.city, business.category, slug)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.businessName,
    description: business.description,
    url: `${BASE_URL}/${slug}`,
    telephone: business.phone,
    address: { '@type': 'PostalAddress', streetAddress: business.address, addressLocality: business.city, addressCountry: 'PK' },
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <main className="bg-[#f8fafc] min-h-screen">
        <section className="bg-white border-b border-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="shrink-0">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.businessName} className="w-32 h-32 rounded-2xl object-cover border border-gray-200" />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-4">{business.businessName}</h1>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-50 text-[#60a5fa] px-3 py-1 rounded-full text-sm font-medium">{businessCategory?.name || business.category}</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="w-4 h-4" /> {business.city}</span>
                </div>
                <p className="text-gray-600 text-lg mb-8">{business.description}</p>
                <div className="flex flex-wrap gap-4">
                  <a href={`tel:${business.phone}`} className="px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1a3f57]"><Phone className="w-4 h-4" /> Call Now</a>
                  {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-green-700"><MessageCircle className="w-4 h-4" /> WhatsApp</a>}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">About {business.businessName}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{business.description}</p>
                </div>
                {similarBusinesses.length > 0 && (
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold text-[#0f2b3d]">Similar Businesses in {business.city}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {similarBusinesses.map(biz => (
                          <Link key={biz.id} href={`/${biz.slug}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center gap-3">
                             <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0"><Building2 className="w-6 h-6 text-gray-400" /></div>
                             <span className="font-semibold text-gray-900 truncate">{biz.businessName}</span>
                          </Link>
                        ))}
                      </div>
                   </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                   <h3 className="font-bold text-[#0f2b3d] mb-4">Contact Details</h3>
                   <div className="space-y-4">
                      <div className="flex gap-3"><Phone className="w-5 h-5 text-[#60a5fa]" /> <div><p className="font-medium">{business.phone}</p><p className="text-xs text-gray-500">Phone Number</p></div></div>
                      <div className="flex gap-3"><MapPin className="w-5 h-5 text-[#60a5fa]" /> <div><p className="font-medium">{business.address}</p><p className="text-xs text-gray-500">{business.city}, Pakistan</p></div></div>
                   </div>
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
