// Server Component: no 'use client' directive.
// Only the search form (HeroSearchForm) is a client component.
// This means the hero shell (H1, description, links) is rendered as static HTML
// with zero JS overhead: critical for FCP and LCP.

import Link from 'next/link'
import HeroSearchForm from './hero-search-form'

export default function HeroSection() {
  return (
    <section
      className="relative bg-[#0f2b3d] overflow-hidden py-16 md:py-28"
      aria-labelledby="hero-heading"
    >
      {/* Decorative circles: pure CSS, no JS */}
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
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 text-balance"
        >
          Find Any Business in Pakistan – Karachi, Lahore, Islamabad & Beyond
        </h1>
        <p className="text-[#60a5fa] font-semibold text-sm sm:text-base mb-6 tracking-wide uppercase">
          Pakistan Business Directory: Connecting local shops with buyers across the country.
        </p>
        <div className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto space-y-4">
          <p>
            Many local shops in Bolton Market Karachi and Anarkali Lahore lose good customers every single day. Millions of Pakistani businesses are invisible online because buyers cannot find them. Your customers want to buy from you, but they do not know your phone number or where your shop is located.
          </p>
          <p>
            We want to help you fix this. Our website gives you free, verified, nationwide, and searchable listings. Now, people from any city can find your business, see your details, and call you directly without any trouble.
          </p>
          <p>
            Pakistan has 5.2 million registered SMEs according to SMEDA, but only 12% have an active online presence. We must change this to grow our economy. List your business today — it takes under 5 minutes and costs nothing.
          </p>
        </div>

        {/* Search Bar: client component for interactivity */}
        <HeroSearchForm />

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
            <span className="bg-white/10 px-3 py-1 rounded-full">15,000+ Listings</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">150+ Cities</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Verified Contacts</span>
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
            href="/restaurants/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            🍽️ Restaurants
          </Link>
          <span className="text-white/30">•</span>
          <Link
            href="/healthcare/"
            className="text-white/60 hover:text-white text-xs sm:text-sm transition-colors"
          >
            🏥 Healthcare
          </Link>
        </div>

        {/* Popular Searches: keyword-rich city+category links */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-white/40 text-xs">Popular:</span>
          {[
            { href: '/karachi/restaurants/', label: 'Restaurants Karachi' },
            { href: '/lahore/real-estate/', label: 'Real Estate Lahore' },
            { href: '/islamabad/technology/', label: 'IT Companies Islamabad' },
            { href: '/karachi/healthcare/', label: 'Clinics Karachi' },
            { href: '/beauty/', label: 'Beauty Salons' },
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
