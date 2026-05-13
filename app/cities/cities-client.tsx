'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, Building2, TrendingUp, Star } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { CATEGORIES } from '@/lib/data'
import { CITIES } from '@/lib/data'

function CitiesContent() {
  const searchParams = useSearchParams()
  const [queryText, setQueryText] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || '')

  const filteredCities = useMemo(() => {
    return CITIES.filter((cityName) => {
      return cityName.toLowerCase().includes(queryText.toLowerCase())
    })
  }, [queryText])

  const citiesByLetter = useMemo(() => {
    const grouped: Record<string, string[]> = {}
    filteredCities.forEach(city => {
      const firstLetter = city.charAt(0).toUpperCase()
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = []
      }
      grouped[firstLetter].push(city)
    })
    return grouped
  }, [filteredCities])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-3 bg-[#60a5fa]/10 text-[#60a5fa] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MapPin className="w-4 h-4" />
              All Pakistan Cities
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Explore {CITIES.length}+ Cities Across Pakistan
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Find businesses and services in every city from Karachi to Islamabad, Lahore to Quetta, and everywhere in between.
            </p>
          </div>
        </section>

        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Cities
                </label>
                <CitySearchDropdown
                  value={city}
                  onChange={(value) => setCity(value)}
                  placeholder="Search for a city..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Filter by Category
                </label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 text-blue-900">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{CITIES.length}+ Cities</span>
                </div>
                <p className="text-sm text-blue-700 mt-2">Complete coverage across Pakistan</p>
                <div className="flex items-center gap-2 mt-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-blue-700">Verified businesses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {queryText && (
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  Found {filteredCities.length} cities matching "{queryText}"
                </p>
              </div>
            )}

            <div className="space-y-12">
              {Object.entries(citiesByLetter).map(([letter, cities]) => (
                <div key={letter}>
                  <h3 className="text-2xl font-bold text-[#0f2b3d] mb-6 flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg">{letter}</span>
                    <span className="text-gray-600">({cities.length} cities)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {cities.map((cityName) => (
                      <Link
                        key={cityName}
                        href={selectedCat ? `/${cityName.toLowerCase().replace(/ /g, '-')}/${selectedCat}/` : `/${cityName.toLowerCase().replace(/ /g, '-')}/`}
                        className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                      >
                        <div className="flex flex-col items-center">
                          <MapPin className="w-6 h-6 text-blue-600 mb-3 group-hover:text-blue-700" />
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 mb-2">
                            {cityName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Find local businesses
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function CitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-r-2 border-t-2 border-blue-600"></div>
      </div>
    }>
      <CitiesContent />
    </Suspense>
  )
}
