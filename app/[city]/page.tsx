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
import { generateCategoryContent, generateCityContent, CITY_INFO } from '@/lib/seo-content'
import { getCategoryKeywordCluster, getCityKeywordCluster } from '@/lib/organic-keywords'
import BannerAd from '@/components/ads/banner-ad'
import NativeAd from '@/components/ads/native-ad'
import React from 'react'

// Disable caching so new/updated business data appears immediately
export const revalidate = 60
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.pakbizbranhces.online'

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

interface ServiceItem {
  title: string
  desc: string
}

function getServicesByCategory(category: string, businessName: string): ServiceItem[] {
  const defaultServices: ServiceItem[] = [
    { title: 'Custom Business Solutions', desc: `Tailored options designed to meet the unique needs of ${businessName} clients.` },
    { title: 'Client Consulting & Support', desc: 'Direct, responsive communication channels for immediate assistance.' },
    { title: 'Standardized Quality Auditing', desc: 'A strict commitment to performance, reliability, and service excellence.' },
    { title: 'Local Service Delivery', desc: 'Efficient service execution aligned with international best practices.' }
  ]

  const serviceMap: Record<string, ServiceItem[]> = {
    'restaurants': [
      { title: 'Fine Dining & Culinary Experience', desc: 'Enjoy custom food menus, authentic international and local cuisines, and refined group dining options.' },
      { title: 'Takeaway & Express Home Delivery', desc: 'Hygienic and fast packaging with reliable home delivery services to preserve freshness and taste.' },
      { title: 'Private Events & Professional Catering', desc: 'Full-service catering and hosting for corporate gatherings, birthday parties, and custom celebrations.' },
      { title: 'Strict Food Hygiene & Quality Standards', desc: 'Strict adherence to health regulations using only fresh, premium, and hand-selected ingredients.' }
    ],
    'real-estate': [
      { title: 'Residential Property Sales & Leasing', desc: 'Browse verified listings for luxury houses, modern apartments, villas, and secure residential plots.' },
      { title: 'Commercial Real Estate Advisory', desc: 'Find premium office spaces, retail showrooms, warehouses, and get expert investment guidance.' },
      { title: 'Comprehensive Property Management', desc: 'Rent collection, property maintenance, tenant verification, and standardized portfolio management.' },
      { title: 'Valuation & Legal Documentation Assistance', desc: 'Accurate real estate market valuation combined with seamless, secure legal ownership transfers.' }
    ],
    'technology': [
      { title: 'Custom Software & Web App Development', desc: 'Bespoke corporate websites, web portals, cloud application designs, and custom API integrations.' },
      { title: 'IT Infrastructure Setup & Network Solutions', desc: 'Secure network planning, server maintenance, active firewall setup, and 24/7 technical support.' },
      { title: 'Mobile App Engineering (iOS & Android)', desc: 'User-friendly native and cross-platform mobile apps featuring intuitive user interfaces.' },
      { title: 'Cyber Security & Digital Transformation', desc: 'Advanced cloud migration services, system automation, and strict vulnerability audits.' }
    ],
    'healthcare': [
      { title: 'General Medicine & Diagnostic Consultation', desc: 'Professional outpatient care, specialized clinical checkups, and comprehensive laboratory referrals.' },
      { title: 'Specialized Treatments & Chronic Care', desc: 'Expert medical interventions for specialized disorders and personalized treatment plans.' },
      { title: 'Emergency Care & Round-the-Clock Support', desc: 'Immediate medical attention, active nursing care, and trusted emergency service coordination.' },
      { title: 'Preventive Health Screenings & Wellness', desc: 'Regular preventive health checkups, cardiovascular screenings, and professional lifestyle counseling.' }
    ],
    'education': [
      { title: 'Standard Academic Curriculum Tutoring', desc: 'Structured learning programs for school, college, and university students across major disciplines.' },
      { title: 'Professional Skill-Based Certifications', desc: 'Industry-standard training in software coding, language fluency, and corporate management.' },
      { title: 'Career Guidance & Academic Counseling', desc: 'One-on-one sessions for local and international university admissions and career pathway planning.' },
      { title: 'Interactive Workshops & Live Seminars', desc: 'Practical, hands-on learning sessions led by domain experts to foster real-world understanding.' }
    ],
    'retail': [
      { title: 'Premium Product Inventory Selection', desc: 'Wide range of high-quality products from top local and international brands under one roof.' },
      { title: 'Customer-Centric Shopping Experience', desc: 'Dedicated instore support, easy exchanges, product demonstrations, and customer loyalty rewards.' },
      { title: 'Wholesale & B2B Bulk Commercial Supply', desc: 'Cost-effective bulk purchasing options with special commercial discounts for corporate buyers.' },
      { title: 'Genuine Brand & Warranty Assurance', desc: 'Rest assured with 100% original merchandise backed by official manufacturer warranties.' }
    ],
    'construction': [
      { title: 'Architectural Design & Modern Blueprints', desc: 'Vibrant 3D interior/exterior concepts and comprehensive structural blueprints.' },
      { title: 'General Contracting & Civil Engineering', desc: 'High-quality gray structure construction, foundation works, and commercial high-rise building.' },
      { title: 'Premium Interior Design & Finishes', desc: 'Elegant false ceiling work, premium wood paneling, tile installation, and customized modular kitchens.' },
      { title: 'High-Grade Materials Procurement', desc: 'Sourcing certified grade-60 steel, premium cement brands, and durable electrical/plumbing fittings.' }
    ],
    'automotive': [
      { title: 'Periodic Maintenance & Dynamic Oil Change', desc: 'Engine tuning, comprehensive fluid top-ups, filter replacements, and standard computer diagnostics.' },
      { title: 'Mechanical, Suspension & Electrical Repairs', desc: 'Advanced suspension overhaul, transmission diagnostics, brake servicing, and electrical wiring fixes.' },
      { title: 'Certified OEM Spare Parts Replacement', desc: 'Guaranteed genuine manufacturer spare parts ensuring maximum vehicle longevity and safety.' },
      { title: 'Premium Detailing & Interior Deep Cleaning', desc: 'Multi-stage paint correction, ceramic coatings, steam car washing, and leather conditioning.' }
    ],
    'finance': [
      { title: 'Commercial Business Account Services', desc: 'Structured corporate bank accounts, payment processing setups, and business credit solutions.' },
      { title: 'Financial Planning & Wealth Management', desc: 'Personalized investment portfolios, savings schemes, and long-term asset diversification advice.' },
      { title: 'Corporate Loan & Credit Facility Auditing', desc: 'Streamlined loan applications for home financing, commercial expansion, and auto leasing.' },
      { title: 'Secure Digital Payment Gateways', desc: 'Integration of highly secure web-based payment networks and encrypted mobile transfers.' }
    ],
    'travel': [
      { title: 'Worldwide Air Ticketing & Seat Booking', desc: 'Affordable domestic and international flight options across leading global airlines.' },
      { title: 'Custom Holiday Packages & Hotel Stays', desc: 'Tailor-made itineraries, verified premium hotel bookings, and safe local sightseeing guides.' },
      { title: 'Visa Documentation & Passport Assistance', desc: 'Professional review of travel documents, application support, and travel insurance policy procurement.' },
      { title: 'Executive B2B Travel Management', desc: 'Corporate travel booking coordination, airport lounge access, and premium car rental services.' }
    ],
    'beauty': [
      { title: 'High-End Hair Styling, Cuts & Coloring', desc: 'Trendy haircuts, scalp treatments, protein therapies, and professional coloring services.' },
      { title: 'Bridal & Party Makeover Artistry', desc: 'Flawless makeup packages for weddings and special occasions using high-end cosmetic brands.' },
      { title: 'Skin Care, HydraFacials & Organic Therapy', desc: 'Deep skin cleansing, organic facials, anti-acne treatments, and skin rejuvenation programs.' },
      { title: 'Relaxing Spa Massages & Body Treatment', desc: 'Aromatherapy, therapeutic body scrubs, and deep tissue stress-relief massage therapies.' }
    ],
    'logistics': [
      { title: 'Nationwide Cargo & Courier Logistics', desc: 'Secure parcel delivery, heavy freight shipping, and real-time package tracking facilities.' },
      { title: 'Safe Warehousing & Commercial Storage', desc: 'Secure, clean, and spacious inventory storage options with active barcode cataloging.' },
      { title: 'Supply Chain & Merchant Distribution', desc: 'Fleet management, merchant distribution routes, and end-to-end commercial supply logistics.' },
      { title: 'Heavy Vehicle Fleet & Container Shipping', desc: 'Specialized shipping services for heavy machinery, bulk materials, and cargo container transport.' }
    ]
  }

  return serviceMap[category] ?? defaultServices
}

function generateDynamicAboutSection(business: Business, categoryName: string): string {
  const parts = [
    `Welcome to the professional profile of ${business.businessName}, a highly regarded and verified ${categoryName} company operating in ${business.city}, Pakistan.`,
    `As an established leader within the local ${categoryName.toLowerCase()} sector, ${business.businessName} has built a solid reputation for delivering exceptional service quality, reliability, and professional solutions to clients across the region.`,
    `Conveniently located at their physical address: ${business.address}, ${business.city}, they serve as a vital hub for local patrons looking for expert ${categoryName.toLowerCase()} assistance.`,
    `Whether you are seeking customized options, expert consultation, or everyday support, their team is dedicated to meeting your precise business and personal requirements with professionalism.`
  ]

  if (business.whatsapp || business.email || business.websiteUrl) {
    parts.push(
      `To ensure seamless accessibility and customer convenience, ${business.businessName} offers multiple communication channels. You can easily reach their official representatives by calling their primary phone number at ${business.phone}${business.whatsapp ? ` or messaging them on WhatsApp` : ''}${business.email ? ` or via email at ${business.email}` : ''}.`
    )
  } else {
    parts.push(
      `To ensure seamless accessibility and customer convenience, ${business.businessName} maintains active communication lines. You can easily reach their official representatives by calling their primary phone number at ${business.phone} for immediate assistance, booking inquiries, or service consultations.`
    )
  }

  parts.push(
    `By choosing a verified listing like ${business.businessName} on the PakBizBranches business directory, you are guaranteed authentic contact details, correct address mapping, and direct connection pathways to premium services in ${business.city}.`
  )

  return parts.join(' ')
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

async function getBusinessBranches(businessName: string, excludeSlug: string): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('businessName', '==', businessName),
      limit(40)
    )
    const snap = await getDocs(q)
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Business))
      .filter(b => {
        const status = String((b as any).status ?? '').toLowerCase()
        return (!status || LIVE_STATUSES.has(status)) && b.slug !== excludeSlug
      })
  } catch {
    return []
  }
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params.city

  // Check if it's a City
  const cityName = findCityBySlug(slug)
  if (cityName) {
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

    let title = `${cityName} Business Directory: Find Local Companies`
    if (title.length < 50) {
      title = `${cityName} Business Directory: Find Verified Local Companies`
    }
    if (title.length > 60) {
      title = title.substring(0, 60)
    }

    let description = `Search verified local businesses in ${cityName}. Find phone numbers, WhatsApp, and physical addresses on the trusted PakBizBranches directory free.`
    if (description.length < 140) {
      description = `Search verified local businesses in ${cityName}. Find phone numbers, WhatsApp contacts, and physical addresses on the trusted PakBizBranches directory free.`
    }
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCityKeywordCluster(cityName)

    return {
      title,
      description,
      keywords: [`${cityName} business directory`, `businesses in ${cityName}`, `${cityName} local services`, ...keywordCluster],
      robots: {
        index: businessesCount >= 3,
        follow: true,
      },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // Check if it's a Category
  const category = findCategoryBySlug(slug)
  if (category) {
    let businessesCount = 0
    try {
      const q = query(
        collection(db, 'businesses'),
        where('categoryId', '==', slug),
        limit(3)
      )
      const snap = await getDocs(q)
      businessesCount = snap.size
    } catch {}

    if (businessesCount === 0) {
      try {
        const categoryValues = getPossibleCategoryValues(slug).slice(0, 5)
        const qFallback = query(
          collection(db, 'businesses'),
          where('category', 'in', categoryValues),
          limit(3)
        )
        const snapFallback = await getDocs(qFallback)
        businessesCount = snapFallback.size
      } catch {}
    }

    let title = `${category.name} in Pakistan: Find Verified Contact Details`
    if (title.length > 60) {
      title = `${category.name} in Pakistan: Verified Contacts`
    }
    if (title.length < 50) {
      title = `Best ${category.name} in Pakistan: Find Verified Contacts`
    }
    if (title.length < 50) {
      title = `Best ${category.name} Services in Pakistan: Find Local Contacts`
    }
    if (title.length > 60) {
      title = title.substring(0, 60)
    }

    let description = `Browse verified ${category.name.toLowerCase()} listings and local services in Pakistan. Find contact phone numbers, WhatsApp links, and physical addresses free.`
    if (description.length < 140) {
      description = `Browse verified ${category.name.toLowerCase()} listings and local services across Pakistan. Find contact phone numbers, WhatsApp links, and physical addresses free.`
    }
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
    const url = `${BASE_URL}/${slug}/`
    const keywordCluster = getCategoryKeywordCluster(slug)

    return {
      title,
      description,
      keywords: [`${category.name} in Pakistan`, `best ${category.name.toLowerCase()} Pakistan`, ...keywordCluster],
      robots: {
        index: businessesCount >= 3,
        follow: true,
      },
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'PakBizBranches', locale: 'en_PK', type: 'website' },
    }
  }

  // Business Detail
  const business = await getBusinessBySlug(slug)
  if (!business) {
    return {
      title: 'Business Not Found: PakBizBranches',
      description: 'The business you are looking for could not be found.',
    }
  }

  const businessCategory = CATEGORIES.find(c => c.id === business.category)
  const categoryName = businessCategory?.name ?? business.category

  // Phase 3 Meta title format: [Business Name] in [City] – Phone, Address & Contact | PakBizBranches
  const title = `${business.businessName} in ${business.city} – Phone, Address & Contact | PakBizBranches`

  // Phase 3 Meta description format: Find verified phone number, address, and contact for [Business Name] in [City]. [1-sentence generated description].
  let descSentence = ''
  if (business.description) {
    const cleanDesc = business.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const firstPeriod = cleanDesc.indexOf('.')
    if (firstPeriod !== -1 && firstPeriod > 10) {
      descSentence = cleanDesc.substring(0, firstPeriod + 1)
    } else if (cleanDesc.length > 10) {
      descSentence = cleanDesc.length > 100 ? cleanDesc.substring(0, 97) + '...' : cleanDesc
    }
  }
  
  if (descSentence) {
    descSentence = ' ' + descSentence
  }

  let description = `Find verified phone number, address, and contact for ${business.businessName} in ${business.city}.${descSentence}`
  if (description.length > 156) {
    description = description.substring(0, 153) + '...'
  } else if (description.length < 130) {
    description = `Find verified phone number, address, and contact for ${business.businessName} in ${business.city}, Pakistan. Get verified details and connect today.`
  }

  const url = `${BASE_URL}/${slug}/`

  return {
    title,
    description,
    keywords: [
      business.businessName,
      `${business.businessName} ${business.city}`,
      `${categoryName} in ${business.city}`,
      `${business.city} business directory`
    ],
    alternates: { canonical: url },
    openGraph: { 
      title, 
      description, 
      url, 
      siteName: 'PakBizBranches', 
      locale: 'en_PK', 
      type: 'website' 
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

export default async function CatchAllPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params
  const slug = params.city

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
        { '@type': 'ListItem', position: 2, name: cityName, item: `${BASE_URL}/${slug}/` },
      ],
    }

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <main className="bg-[#f8fafc] min-h-screen">
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium">{cityName}</span>
              </nav>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-[#60a5fa]" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">Business Directory {cityName} – Find Local Companies & Services</h1>
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
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: category.name, item: `${BASE_URL}/${slug}/` },
      ],
    }

    return (
      <>
        <Navbar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <main className="bg-[#f8fafc] min-h-screen">
          <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-medium">{category.name}</span>
              </nav>
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
  const branches = await getBusinessBranches(business.businessName, slug)
  const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, Pakistan`)
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
  const pageUrl = `${BASE_URL}/${slug}/`
  const categoryUrl = `/${business.category}/`
  const cityUrl = `/${encodeURIComponent(business.city.toLowerCase().replace(/ /g, '-'))}/`

  const sameAs: string[] = []
  if (business.websiteUrl) sameAs.push(business.websiteUrl)
  if (business.facebookPage) sameAs.push(business.facebookPage)
  if (business.youtubeChannel) sameAs.push(business.youtubeChannel)

  // Look up province from CITY_INFO
  const cityDetails = CITY_INFO[business.city]
  const province = cityDetails?.province ?? 'Punjab'

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': pageUrl,
    name: business.businessName,
    description: business.description || `Verified ${categoryName} company in ${business.city}, Pakistan.`,
    url: pageUrl,
    telephone: business.phone,
    priceRange: '$$',
    ...(business.email && { email: business.email }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: province,
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

  // Phase 4 Services, dynamic about summary, and FAQPage schemas
  const services = getServicesByCategory(business.category, business.businessName)
  const serviceListText = services.map(s => s.title).join(', ')
  const dynamicAbout = generateDynamicAboutSection(business, categoryName)

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
      {
        '@type': 'Question',
        name: `What services does ${business.businessName} offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${business.businessName} specializes in ${categoryName} solutions. Key services include: ${serviceListText}.`,
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
                  {business.description && (
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">{business.description}</p>
                  )}
                  <p className="text-gray-600 leading-relaxed text-lg">{dynamicAbout}</p>
                  
                  <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Professional Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {business.businessName} is a verified <strong>{categoryName}</strong> business serving the <strong>{business.city}</strong> area. 
                    Located at {business.address}, they are committed to providing quality services to their customers.
                  </p>

                  <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Services Offered</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 not-prose">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-2 shrink-0" />
                        <div>
                          <strong className="block text-gray-900 text-sm font-semibold">{service.title}</strong>
                          <span className="block text-gray-500 text-xs mt-0.5">{service.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Contact Information</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>Address:</strong> {business.address}, {business.city}, Pakistan</li>
                    <li><strong>Phone:</strong> <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">{business.phone}</a></li>
                    {business.whatsapp && <li><strong>WhatsApp:</strong> {business.whatsapp}</li>}
                    {business.email && <li><strong>Email:</strong> <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">{business.email}</a></li>}
                  </ul>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0f2b3d]">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">Where is {business.businessName} located?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {business.businessName} is situated at {business.address}, {business.city}, Pakistan.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">What is the contact phone number for {business.businessName}?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        You can contact {business.businessName} by calling their primary phone number at <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">{business.phone}</a>.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-1.5">What services does {business.businessName} provide?</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        As a verified {categoryName} business, they specialize in professional {categoryName.toLowerCase()} solutions. Key services include: {serviceListText}.
                      </p>
                    </div>
                  </div>
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

                {/* Branches in Other Cities */}
                {branches.length > 0 && (
                  <div className="space-y-6 mt-8">
                    <h2 className="text-2xl font-bold text-[#0f2b3d]">{business.businessName} Locations in Other Cities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {branches.map(br => (
                        <Link key={br.id} href={`/${br.slug}/`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#60a5fa]/30 transition-all flex items-center gap-4 group">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50">
                            <MapPin className="w-6 h-6 text-[#60a5fa]" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-gray-900 group-hover:text-[#60a5fa] truncate">{business.businessName} – {br.city}</span>
                            <span className="block text-sm text-gray-500">{br.phone}</span>
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

                {/* Business Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 text-[#60a5fa] flex items-center justify-center">🕒</span> Business Hours
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Monday – Friday:</span>
                      <span className="font-medium text-gray-900">09:00 AM – 06:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-1">
                      <span>Saturday:</span>
                      <span className="font-medium text-gray-900">09:00 AM – 02:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">* Timing may vary. Please call to confirm.</p>
                  </div>
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
