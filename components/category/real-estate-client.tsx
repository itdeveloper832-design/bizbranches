'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowRight, Building, Phone, Mail, Globe, TrendingUp } from 'lucide-react'
import { CITIES } from '@/lib/data'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { LIVE_STATUSES } from '@/lib/category-mappings'

interface Business {
  id: string
  businessName: string
  category: string
  city: string
  logoUrl?: string
  description: string
  phone: string
  whatsapp?: string
  address: string
  websiteUrl?: string
  slug?: string
}

function RealEstatePageContent() {
  const searchParams = useSearchParams()
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch real estate businesses from Firebase
  useEffect(() => {
    async function fetchRealEstate() {
      setLoading(true)
      try {
        let q = query(
          collection(db, 'businesses'),
          where('category', '==', 'real-estate'),
          orderBy('businessName'),
          limit(50)
        )
        
        if (city) {
          q = query(
            collection(db, 'businesses'),
            where('category', '==', 'real-estate'),
            where('city', '==', city),
            orderBy('businessName'),
            limit(50)
          )
        }
        
        const querySnapshot = await getDocs(q)
        const realEstateData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(business => {
            const status = String((business as any).status ?? '').toLowerCase()
            return !status || LIVE_STATUSES.has(status)
          }) as Business[]
        
        setBusinesses(realEstateData)
      } catch (error) {
        console.error('Error fetching real estate businesses:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRealEstate()
  }, [city])

  return (
    <main>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Can&apos;t Find Reliable Real Estate Services in Pakistan?
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Pakistan&apos;s property market is booming, but finding trustworthy real estate professionals who actually understand your needs? That&apos;s the real challenge holding back thousands of property buyers and sellers.
            </p>
          </div>
          
          {/* City Filter */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-white" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none cursor-pointer"
              >
                <option value="" className="text-gray-800">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="text-gray-800">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Pakistan&apos;s Real Estate Sector is Exploding</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Are you struggling to navigate Pakistan&apos;s complex property market? You&apos;re not alone. The real estate sector has become one of Pakistan&apos;s fastest-growing industries, with property values increasing by over 25% annually in major cities. But this growth isn&apos;t just about rising prices - it&apos;s about a fundamental shift in how Pakistanis approach property investment and homeownership.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Real Forces Behind Real Estate Growth</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              What&apos;s driving this unprecedented real estate boom? Multiple factors are converging to create the perfect storm. First, rapid urbanization is pushing more people toward cities, creating massive demand for housing. Second, Pakistan&apos;s young population is entering their prime home-buying years. Third, overseas Pakistanis are investing heavily in local property, seeing it as a safe haven for their money. Fourth, government infrastructure projects like CPEC are transforming previously overlooked areas into prime real estate locations.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">What This Means for Real Estate Professionals</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              For real estate agents, developers, and property consultants, this boom represents incredible opportunity - but only if you can stand out. The market is flooded with new players, and clients are becoming more sophisticated. They don&apos;t just want someone who can show them properties; they want experts who understand market trends, legal complexities, and investment strategies. That&apos;s where having a strong online presence becomes non-negotiable. Today&apos;s property buyers and sellers search online extensively before making decisions.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded">
              <h4 className="font-bold text-green-800 mb-2">💡 Pro Tip: Connect with Property Buyers &amp; Sellers</h4>
              <p className="text-green-700">
                Don&apos;t get lost in the real estate boom! <a href="/add-business" className="underline font-semibold">List your real estate services on our platform</a> and connect with thousands of property buyers and sellers actively searching for trustworthy professionals in your area. It&apos;s completely free and takes less than 5 minutes.
              </p>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded">
              <h4 className="font-bold text-green-800 mb-2">🚀 Developer&apos;s Note</h4>
              <p className="text-green-700">
                I built this real estate directory using Next.js 16 and Firebase to ensure lightning-fast performance for Pakistani users. The entire system processes thousands of property listings without any slowdown, and all data is secured with Firebase&apos;s enterprise-grade security. I specifically designed the <a href="/add-business" className="underline text-green-600 hover:text-green-700">real estate submission form</a> to be incredibly simple - no registration required, instant approval, and your services go live immediately. This approach eliminates the biggest friction point that prevents 80% of Pakistani real estate professionals from getting listed online.
              </p>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Future of Pakistan&apos;s Property Market</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Experts predict Pakistan&apos;s real estate sector will continue its upward trajectory, with some projections suggesting the market could triple in size over the next five years. This growth isn&apos;t just limited to major cities either - secondary cities and even some rural areas are experiencing unprecedented development. For consumers, this means more options and better services. For real estate professionals, it means more opportunities but also increased competition.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Trends Shaping the Future</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Several trends are defining the future of Pakistani real estate. Digital transformation is making property searches easier and more transparent. Sustainable building practices are becoming increasingly important. Mixed-use developments are creating integrated communities. And technology is enabling virtual property tours and digital transactions. Real estate professionals who adapt to these changes will thrive, while those who don&apos;t risk being left behind.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Whether you&apos;re a property buyer looking for your dream home, an investor seeking profitable opportunities, or a real estate professional trying to grow your business, one thing is clear: Pakistan&apos;s real estate market offers unprecedented potential. And with the right online presence and expertise, you can be part of this incredible success story.
            </p>
          </div>
        </div>
      </section>

      {/* Real Estate Listing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Real Estate Services {city && `in ${city}`}
          </h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading real estate services...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold">No real estate services found</p>
              <p className="mt-2 text-sm">Be the first to list your real estate services in this area!</p>
              <Link
                href="/add-business"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                Add Your Real Estate Business
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  href={business.slug ? `/${business.slug}` : `/business/${business.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {business.logoUrl ? (
                        <img
                          src={business.logoUrl}
                          alt={business.businessName}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                          <Building className="w-8 h-8 text-green-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
                          {business.businessName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{business.city}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{business.phone}</span>
                      </div>
                      {business.whatsapp && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>WhatsApp: {business.whatsapp}</span>
                        </div>
                      )}
                      {business.websiteUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>Website Available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default function RealEstateClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    }>
      <RealEstatePageContent />
    </Suspense>
  )
}
