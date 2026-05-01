'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin } from 'lucide-react'
import { CITIES } from '@/lib/data'

export default function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    router.push(`/categories?${params.toString()}`)
  }

  return (
    <section
      className="relative bg-[#0f2b3d] overflow-hidden py-16 md:py-28"
      aria-labelledby="hero-heading"
    >
      {/* Decorative circles */}
      <div aria-hidden="true" className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#60a5fa]/10" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#0ea5e9]/8" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="inline-flex items-center gap-2 text-[#60a5fa] font-semibold text-sm mb-2 tracking-wide uppercase">
          <span className="w-4 h-px bg-[#60a5fa]" />
          Pakistan&apos;s #1
          <span className="w-4 h-px bg-[#60a5fa]" />
          Business Directory
          <span className="w-4 h-px bg-[#60a5fa]" />
        </p>

        <h1
          id="hero-heading"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
        >
          Find Trusted Businesses in Pakistan by City and Category
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
          PakBizBranches helps people discover verified local businesses fast, and helps owners get found with a free business listing.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-6 sm:mt-8 lg:mt-10 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3"
          role="search"
          aria-label="Search businesses"
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses, categories..."
              className="flex-1 text-gray-800 placeholder-gray-400 bg-transparent outline-none text-sm sm:text-base py-1"
              aria-label="Search query"
            />
          </div>
          <div className="flex items-center gap-2 sm:border-l border-gray-200 sm:pl-3 px-3">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" aria-hidden="true" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-sm text-gray-600 outline-none pr-2 py-1 cursor-pointer"
              aria-label="Select city"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#0f2b3d] hover:bg-[#1a3f57] text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/add-business/"
            className="bg-[#60a5fa] hover:bg-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer text-center"
          >
            List Your Business for Free
          </Link>
          <Link
            href="/categories/"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-colors duration-200 text-sm sm:text-base border border-white/20 backdrop-blur-sm hover:border-white/30 cursor-pointer text-center"
          >
            Browse Categories
          </Link>
        </div>

        <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 max-w-2xl mx-auto border border-white/20">
          <p className="text-white/90 text-sm sm:text-base">
            Pakistan business directory with city pages, category pages, and direct contact details to help users quickly compare local services.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-white/85">
            <span className="bg-white/10 px-3 py-1 rounded-full">50,000+ Listings</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">150+ Cities</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">12 Main Categories</span>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/blog/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            📚 Business Guide
          </Link>
          <span className="text-white/30">•</span>
          <Link
            href="/blog/how-to-add-business/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            📝 How to Add Business Free
          </Link>
          <span className="text-white/30">•</span>
          <Link
            href="/categories/restaurants/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            🍽️ Restaurants
          </Link>
          <span className="text-white/30">•</span>
          <Link
            href="/categories/healthcare/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            🏥 Healthcare
          </Link>
        </div>

        {/* Popular Searches — keyword-rich city+category links */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-white/40 text-xs">Popular:</span>
          {[
            { href: '/locations/karachi/restaurants/', label: 'Restaurants Karachi' },
            { href: '/locations/lahore/real-estate/', label: 'Real Estate Lahore' },
            { href: '/locations/islamabad/technology/', label: 'IT Companies Islamabad' },
            { href: '/locations/karachi/healthcare/', label: 'Clinics Karachi' },
            { href: '/categories/beauty/', label: 'Beauty Salons' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white/50 hover:text-white/80 text-xs px-2 py-0.5 rounded border border-white/10 hover:border-white/25 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <p className="mt-4 sm:mt-6 text-white/40 text-xs sm:text-sm">
          Popular: Restaurants, Real Estate, Healthcare, Technology
        </p>
      </div>
    </section>
  )
}
