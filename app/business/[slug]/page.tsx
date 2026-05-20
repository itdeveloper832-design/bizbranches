import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle, Building2, Globe, Facebook, Youtube, ExternalLink } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { CATEGORIES } from '@/lib/data'
import { LIVE_STATUSES } from '@/lib/category-mappings'

// ISR: revalidate every 5 minutes: business data is relatively stable.
// On-demand revalidation can be triggered via the IndexNow API route.
export const revalidate = 300

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

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    // 1. Try fetching by slug (New optimized structure)
    const q = query(
      collection(db, 'businesses'),
      where('slug', '==', slug),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Business
    }

    // 2. Fallback: Try fetching by ID (Legacy support)
    // Next.js params will treat /business/ID as /business/[slug]
    const { doc, getDoc } = await import('firebase/firestore')
    const docRef = doc(db, 'businesses', slug)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Business
    }

    return null
  } catch (error) {
    console.error('Error fetching business:', error)
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
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    return {
      title: 'Business Not Found: PakBizBranches',
      description: 'The business you are looking for could not be found.',
    }
  }

  const category = CATEGORIES.find(c => c.id === business.category)
  const categoryName = category?.name ?? business.category
  const locationLabel = business.city

  let title = `${business.businessName} in ${locationLabel}: Phone and Address Details`
  if (title.length > 60) {
    title = `${business.businessName} in ${locationLabel}: Contact Details`
  }
  if (title.length > 60) {
    title = `${business.businessName} in ${locationLabel}: Phone Number`
  }
  if (title.length > 60) {
    title = `${business.businessName} in ${locationLabel}`
  }
  if (title.length > 60) {
    title = business.businessName
  }
  if (title.length > 60) {
    title = title.substring(0, 57) + '...'
  }
  if (title.length < 50) {
    title = `Verified Details for ${business.businessName} in ${locationLabel}`
    if (title.length > 60) {
      title = title.substring(0, 60)
    }
  }

  let description = `${business.businessName} is a verified ${categoryName.toLowerCase()} business in ${business.city}, Pakistan. Get direct phone number ${business.phone}, address, and WhatsApp contact free.`
  if (description.length > 155) {
    description = description.substring(0, 152) + '...'
  } else if (description.length < 140) {
    description = `${business.businessName} is a verified ${categoryName.toLowerCase()} business in ${business.city}, Pakistan. Get direct phone number ${business.phone}, address, and WhatsApp contact free on PakBizBranches.`
    if (description.length > 155) {
      description = description.substring(0, 152) + '...'
    }
  }

  const url = `https://pakbizbranhces.online/business/${params.slug}/`

  return {
    title,
    description,
    keywords: [
      business.businessName,
      `${business.businessName} ${business.city}`,
      `${business.businessName} contact`,
      `${business.businessName} address`,
      `${business.businessName} details`,
      categoryName,
      `${categoryName} in ${business.city}`,
      `${business.city} business directory`,
      'Pakistan business directory',
    ].join(', '),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'website',
      images: business.logoUrl
        ? [{ url: business.logoUrl, alt: `${business.businessName} logo` }]
        : [{ url: 'https://pakbizbranhces.online/logo-img.png', alt: 'PakBizBranches' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BusinessPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    notFound()
  }

  const category = CATEGORIES.find(c => c.id === business.category)
  const whatsappUrl = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`
    : null
  const mapQuery = encodeURIComponent(`${business.address}, ${business.city}, Pakistan`)
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
  const similarBusinesses = await getSimilarBusinesses(business.city, business.category, params.slug)

  const pageUrl = `https://pakbizbranhces.online/business/${params.slug}/`
  const categoryUrl = `/categories/${business.category}/`
  const cityUrl = `/cities/${encodeURIComponent(business.city.toLowerCase().replace(/ /g, '-'))}/`

  const sameAs: string[] = []
  if (business.websiteUrl) sameAs.push(business.websiteUrl)
  if (business.facebookPage) sameAs.push(business.facebookPage)
  if (business.youtubeChannel) sameAs.push(business.youtubeChannel)

  const localBusinessSchema: Record<string, unknown> = {
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
    areaServed: {
      '@type': 'City',
      name: business.city,
    },
    ...(category && { knowsAbout: category.name }),
    ...(business.logoUrl && { image: business.logoUrl, logo: business.logoUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pakbizbranhces.online/' },
      { '@type': 'ListItem', position: 2, name: category?.name ?? business.category, item: `https://pakbizbranhces.online${categoryUrl}` },
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
      {
        '@type': 'Question',
        name: `What category does ${business.businessName} belong to?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${business.businessName} is listed under the ${category?.name ?? business.category} category.`,
        },
      },
    ],
  }

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="bg-[#f8fafc] min-h-screen">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link>
              <span>/</span>
              {category && (
                <>
                  <Link href={categoryUrl} className="hover:text-[#60a5fa] transition-colors">
                    {category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-800 font-medium truncate">{business.businessName}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="shrink-0">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={`${business.businessName} logo`}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center border border-gray-200">
                    <Building2 className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2b3d] mb-2">
                  {business.businessName} {business.city}
                </h1>
                <p className="text-sm text-gray-500 mb-3">
                  Official Details &amp; Contact Information
                </p>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-4">
                  {category && (
                    <Link
                      href={categoryUrl}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      {category.name}
                    </Link>
                  )}
                  <Link
                    href={cityUrl}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {business.city}
                  </Link>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {business.description}
                </p>

                {/* Contact Actions */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] text-white rounded-xl font-semibold hover:bg-[#1a3f57] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}

                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-4">
                    About {business.businessName}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">
                    {business.description}
                  </p>

                  <div className="prose prose-blue max-w-none">
                    <h3 className="text-xl font-bold text-[#0f2b3d] mb-4">Professional Overview & Services</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {business.businessName} is a premier <strong>{category?.name || 'local business'}</strong> established to serve the community of <strong>{business.city}</strong> and surrounding areas in Pakistan. 
                      Located at {business.address}, this {category?.name || 'service provider'} has built a reputation for excellence within the {business.category} industry. 
                      By providing reliable and verified services, {business.businessName} has become a trusted name for residents of {business.city}.
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Whether you are looking for specific expertise in {business.subCategory || (category?.name ?? 'local services')} or general assistance, {business.businessName} provides 
                      verified expertise and dedicated support to its clients. Their commitment to quality and customer satisfaction is reflected in their professional approach 
                      to serving the {business.city} market.
                    </p>

                    <h3 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">Why Connect with {business.businessName}?</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Verified Listing:</strong> This business has been verified on PakBizBranches, ensuring you get accurate contact details.</li>
                      <li><strong>Local Expertise:</strong> Deeply rooted in {business.city}, they understand the local needs and standards of Pakistani customers.</li>
                      <li><strong>Direct Contact:</strong> No middlemen: connect directly via phone at <a href={`tel:${business.phone}`} className="text-[#60a5fa] font-medium">{business.phone}</a>{business.whatsapp ? ` or WhatsApp at ${business.whatsapp}` : ''}.</li>
                      <li><strong>Central Location:</strong> Conveniently located at {business.address} for easy access within {business.city}.</li>
                    </ul>

                    <p className="text-gray-600 leading-relaxed mt-6 italic bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      &quot;As part of our commitment to transparency at PakBizBranches, we provide comprehensive details for {business.businessName} 
                      to help you make informed decisions. This listing is part of our extensive directory of businesses in {business.city}, helping local residents and visitors 
                      discover the best {category?.name || 'services'} in the region.&quot;
                    </p>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-[#0f2b3d] mb-2">How do I contact {business.businessName}?</h3>
                      <p className="text-gray-600">You can call them directly at <a href={`tel:${business.phone}`} className="text-[#60a5fa] hover:underline font-medium">{business.phone}</a> or visit them at {business.address}, {business.city}.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0f2b3d] mb-2">What services does {business.businessName} provide?</h3>
                      <p className="text-gray-600">As a business in the {category?.name ?? business.category} category, they provide services related to {business.subCategory || (category?.name ?? business.category)}. Contact them for specific service details.</p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-6 pb-0">
                    <h2 className="text-xl font-bold text-[#0f2b3d] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#60a5fa]" />
                      Location
                    </h2>
                  </div>
                  <div className="mt-4">
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${business.businessName}`}
                      className="w-full"
                    />
                  </div>
                  <div className="p-4 text-sm text-gray-500">
                    {business.address}, {business.city}, Pakistan
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#0f2b3d] mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{business.phone}</p>
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                    </div>

                    {business.whatsapp && (
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{business.whatsapp}</p>
                          <p className="text-sm text-gray-500">WhatsApp</p>
                        </div>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{business.email}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#60a5fa] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{business.address}</p>
                        <p className="text-sm text-gray-500">{business.city}, Pakistan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#0f2b3d] mb-4">Business Details</h3>
                  <div className="space-y-3">
                    {category && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Category</span>
                        <Link href={categoryUrl} className="text-sm font-medium text-[#60a5fa] hover:underline">
                          {category.name}
                        </Link>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">City</span>
                      <Link href={cityUrl} className="text-sm font-medium text-[#60a5fa] hover:underline">
                        {business.city}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Businesses */}
            {similarBusinesses.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">
                  Similar Businesses in {business.city}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarBusinesses.map(biz => (
                    <Link
                      key={biz.id}
                      href={`/business/${biz.slug}/`}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#60a5fa]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {biz.logoUrl ? (
                        <img
                            src={biz.logoUrl}
                            alt={biz.businessName}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-[#60a5fa] transition-colors text-sm leading-tight truncate">
                            {biz.businessName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {biz.city}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
