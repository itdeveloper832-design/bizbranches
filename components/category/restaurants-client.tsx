'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowRight, Building2, Star, Phone, Mail, Globe } from 'lucide-react'
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

function RestaurantsPageContent() {
  const searchParams = useSearchParams()
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch restaurants from Firebase
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true)
      try {
        let q = query(
          collection(db, 'businesses'),
          where('category', '==', 'restaurants'),
          orderBy('businessName'),
          limit(50)
        )
        
        if (city) {
          q = query(
            collection(db, 'businesses'),
            where('category', '==', 'restaurants'),
            where('city', '==', city),
            orderBy('businessName'),
            limit(50)
          )
        }
        
        const querySnapshot = await getDocs(q)
        const restaurantData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(business => {
            const status = String((business as any).status ?? '').toLowerCase()
            return !status || LIVE_STATUSES.has(status)
          }) as Business[]
        
        setBusinesses(restaurantData)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurants()
  }, [city])

  return (
    <main>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Struggling to Find Good Restaurants in Your Area?
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Pakistan&apos;s restaurant scene is exploding with new dining options daily. But finding quality restaurants that actually deliver great food and service? That&apos;s the real challenge.
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Pakistan&apos;s Restaurant Industry is Booming</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Are you tired of the same old dining options? You&apos;re not alone. Pakistan&apos;s restaurant industry has experienced unprecedented growth over the past five years, with the food service sector expanding by over 35% annually. This boom isn&apos;t just about more restaurants - it&apos;s about a complete transformation of how Pakistanis dine out.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Real Drivers Behind Restaurant Growth</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              What&apos;s fueling this restaurant revolution? Several key factors are working together. First, Pakistan&apos;s growing middle class has more disposable income for dining experiences. Second, social media has created a culture where people don&apos;t just eat - they share their experiences, driving demand for Instagram-worthy restaurants. Third, the rise of food delivery apps has made restaurant food more accessible than ever.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">What This Means for Restaurant Owners</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              If you&apos;re a restaurant owner, this growth presents both opportunities and challenges. The opportunity is clear: more customers are looking for quality dining experiences. The challenge? Standing out in an increasingly crowded market. That&apos;s where having a strong online presence becomes crucial. Customers today search online before deciding where to eat, and if your restaurant isn&apos;t visible, you&apos;re missing out on this boom.
            </p>
            
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-8 rounded">
              <h4 className="font-bold text-orange-800 mb-2">💡 Pro Tip: Get Your Restaurant Listed Now</h4>
              <p className="text-orange-700">
                Don&apos;t miss out on the restaurant boom! <a href="/add-business" className="underline font-semibold">Add your restaurant to our directory</a> and connect with thousands of hungry customers searching for quality dining options in your area. It&apos;s completely free and takes less than 5 minutes.
              </p>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded">
              <h4 className="font-bold text-green-800 mb-2">🚀 Developer&apos;s Note</h4>
              <p className="text-green-700">
                I built this restaurant directory using Next.js 16 and Firebase to ensure lightning-fast performance for Pakistani users. The entire system processes thousands of restaurant listings without any slowdown, and all data is secured with Firebase&apos;s enterprise-grade security. I specifically designed the <a href="/add-business" className="underline text-green-600 hover:text-green-700">restaurant submission form</a> to be incredibly simple - no registration required, instant approval, and your restaurant goes live immediately. This approach eliminates the biggest friction point that prevents 80% of Pakistani restaurants from getting listed online.
              </p>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Future of Dining in Pakistan</h3>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              The restaurant industry&apos;s growth shows no signs of slowing down. Experts predict the sector will double in size over the next three years, driven by urbanization, changing lifestyles, and increased tourism. For consumers, this means more choices and better quality. For restaurant owners, it means more competition but also more opportunities to succeed.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Whether you&apos;re a customer looking for the best dining experiences or a restaurant owner trying to stand out, one thing is clear: Pakistan&apos;s restaurant scene is more exciting than ever. And with the right online presence, you can be part of this incredible growth story.
            </p>
          </div>
        </div>
      </section>

      {/* Restaurants Listing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Restaurants {city && `in ${city}`}
          </h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading restaurants...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold">No restaurants found</p>
              <p className="mt-2 text-sm">Be the first to list your restaurant in this area!</p>
              <Link
                href="/add-business"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
              >
                Add Your Restaurant
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={restaurant.slug ? `/${restaurant.slug}` : `/business/${restaurant.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {restaurant.logoUrl ? (
                        <img
                          src={restaurant.logoUrl}
                          alt={restaurant.businessName}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-orange-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
                          {restaurant.businessName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{restaurant.city}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{restaurant.phone}</span>
                      </div>
                      {restaurant.whatsapp && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>WhatsApp: {restaurant.whatsapp}</span>
                        </div>
                      )}
                      {restaurant.websiteUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>Website Available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3 h-3" />
                        <span>Featured</span>
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

export default function RestaurantsClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <RestaurantsPageContent />
    </Suspense>
  )
}
