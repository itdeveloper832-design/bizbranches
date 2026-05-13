'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, SlidersHorizontal, ArrowRight, Building2, TrendingUp, Star } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { CATEGORIES } from '@/lib/data'
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, CATEGORY_BG_COLORS } from '@/lib/categories'
import { getCategoryIdFromName, isBusinessInCategory } from '@/lib/category-mappings'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { generateCategoryContent, generateCityCategoryContent } from '@/lib/seo-content'

interface Business {
  id: string
  businessName: string
  category: string
  city: string
  logoUrl?: string
  description: string
  phone: string
  address: string
  slug?: string
}

function CategoriesContent() {
  const searchParams = useSearchParams()
  const [queryText, setQueryText] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || '')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (selectedCat && cat.id !== selectedCat) return false
      if (queryText && !cat.name.toLowerCase().includes(queryText.toLowerCase())) return false
      return true
    })
  }, [queryText, selectedCat])

  // Fetch businesses from Firebase
  useEffect(() => {
    async function fetchBusinesses() {
      if (!selectedCat) {
        setBusinesses([])
        return
      }
      
      setLoading(true)
      try {
        // Get the category name from the selected category ID
        const selectedCategory = CATEGORIES.find(c => c.id === selectedCat)
        const categoryName = selectedCategory?.name || selectedCat
        
        console.log('Fetching businesses for category:', selectedCat, ' categoryName:', categoryName)
        
        let q = query(
          collection(db, 'businesses'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc'),
          limit(50) // Increase limit to see more businesses
        )
        
        const querySnapshot = await getDocs(q)
        const allBusinesses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[]
        
        console.log('All approved businesses:', allBusinesses.length)
        console.log('Sample business categories:', allBusinesses.slice(0, 5).map(b => ({ name: b.businessName, category: b.category })))
        
        // Filter businesses using new category mapping system
        const filteredBusinesses = allBusinesses.filter(business => {
          // Filter by category if selected
          if (selectedCat && !isBusinessInCategory(business.category || '', selectedCat)) {
            return false
          }
          
          // Filter by city if selected
          if (city && business.city?.toLowerCase() !== city.toLowerCase()) {
            return false
          }
          
          return true
        })
        
        console.log('Filtered businesses for category:', filteredBusinesses.length)
        console.log('Filtered business names:', filteredBusinesses.map(b => b.businessName))
        
        setBusinesses(filteredBusinesses)
        
      } catch (error) {
        console.error('Error fetching businesses:', error)
        setBusinesses([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchBusinesses()
  }, [selectedCat, city])

  return (
    <main>
      {/* Page Header */}
      <section className="bg-[#0f2b3d] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
            Can't Find the Right Business Category?
          </h1>
          <p className="mt-2 text-white/60 text-lg">
            We've organized all Pakistani businesses into 12 clear categories so customers can find you easily. No more confusion, just results.
          </p>

          {/* Filter Bar */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search categories..."
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                aria-label="Search categories"
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 flex-1">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              <CitySearchDropdown
                value={city}
                onChange={setCity}
                placeholder="All Cities"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer"
                aria-label="Filter category"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid or Business Listings */}
      <section className="py-14 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCat ? (
            // Show businesses for selected category
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0f2b3d]">
                  {CATEGORIES.find(c => c.id === selectedCat)?.name} Businesses
                  {city && ` in ${city}`}
                </h2>
                <button
                  onClick={() => setSelectedCat('')}
                  className="text-[#60a5fa] hover:text-blue-600 text-sm font-medium"
                >
                  ← Back to Categories
                </button>
              </div>

              {/* Dynamic SEO Content Block */}
              <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {(() => {
                  const content = city 
                    ? generateCityCategoryContent(city, selectedCat)
                    : generateCategoryContent(selectedCat);
                  
                  return content.split('\n').slice(0, 3).map((line, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-2">
                      {line.replace(/^## /, '').replace(/^### /, '')}
                    </p>
                  ));
                })()}
                <Link 
                  href={city ? `/${city.toLowerCase().replace(/ /g, '-')}/${selectedCat}/` : `/${selectedCat}/`}
                  className="text-[#60a5fa] text-sm font-semibold hover:underline mt-2 inline-block"
                >
                  Read full guide for {CATEGORIES.find(c => c.id === selectedCat)?.name} →
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading businesses...</p>
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-semibold">No businesses found</p>
                  <p className="mt-2 text-sm">Be the first to list your business in this category!</p>
                  <Link
                    href="/add-business"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold text-sm hover:bg-blue-400 transition-colors"
                  >
                    Add Your Business
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <Link
                      key={business.id}
                      href={business.slug ? `/${business.slug}/` : `/business/${business.id}/`}
                      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#60a5fa]/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        {business.logoUrl ? (
                          <div className="relative">
                            <img
                              src={business.logoUrl}
                              alt={`${business.businessName} logo`}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-100 group-hover:shadow-lg transition-shadow"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#60a5fa] rounded-full flex items-center justify-center">
                              <Star className="w-2 h-2 text-white fill-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 group-hover:shadow-lg transition-shadow">
                            <Building2 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#0f2b3d] text-lg group-hover:text-[#60a5fa] transition-colors line-clamp-1">
                            {business.businessName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{business.city}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span className="font-medium">{business.phone}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 overflow-hidden line-clamp-2 leading-relaxed">
                            {business.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[#60a5fa] text-sm font-medium">
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Star className="w-3 h-3" />
                              <span>Featured</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Show category grid
            filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl font-semibold">No categories found</p>
                <p className="mt-2 text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((cat) => {
                  const IconComponent = CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS]
                  const gradient = CATEGORY_GRADIENTS[cat.id as keyof typeof CATEGORY_GRADIENTS]
                  const bgColor = CATEGORY_BG_COLORS[cat.id as keyof typeof CATEGORY_BG_COLORS]
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.id)}
                      className={`group relative overflow-hidden rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 ${bgColor}`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-black"></div>
                      </div>
                      
                      {/* Icon Container */}
                      <div className={`relative w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative text-center">
                        <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-700 transition-colors">
                          {cat.name}
                        </h2>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{cat.count.toLocaleString()}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs">Popular</span>
                          </div>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60"></div>
                    </button>
                  )
                })}
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0f2b3d]">
            Can&apos;t find your business?
          </h2>
          <p className="mt-2 text-gray-500">List your company for free and reach thousands of customers.</p>
          <Link
            href="/add-business"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-white rounded-xl font-semibold text-sm hover:bg-blue-400 transition-colors duration-200"
          >
            Add Your Business Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default function CategoriesClient() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <CategoriesContent />
      </Suspense>
      <Footer />
    </>
  )
}
