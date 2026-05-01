import Link from 'next/link'
import { CITIES } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

const cityImages: Record<string, string> = {
  Karachi: 'from-blue-500 to-blue-700',
  Lahore: 'from-emerald-500 to-emerald-700',
  Islamabad: 'from-sky-500 to-sky-700',
  Rawalpindi: 'from-indigo-500 to-indigo-700',
  Faisalabad: 'from-amber-500 to-amber-700',
  Multan: 'from-orange-500 to-orange-700',
  Peshawar: 'from-teal-500 to-teal-700',
  Quetta: 'from-purple-500 to-purple-700',
  Sialkot: 'from-rose-500 to-rose-700',
  Hyderabad: 'from-cyan-500 to-cyan-700',
  Gujranwala: 'from-lime-500 to-lime-700',
  Bahawalpur: 'from-pink-500 to-pink-700',
}

const featuredCities = CITIES.slice(0, 20)

export default function CitiesGrid() {
  return (
    <section className="py-16 bg-[#f8fafc]" aria-labelledby="cities-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="cities-heading" className="text-3xl md:text-4xl font-bold text-[#0f2b3d] text-balance">
            Major Cities
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Find businesses in Pakistan&apos;s biggest cities
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {featuredCities.map((city) => (
            <Link
              key={city}
              href={`/cities/${city.toLowerCase().replace(/ /g, '-')}/`}
              title={`Businesses in ${city}, Pakistan`}
              className={`bg-gradient-to-br ${cityImages[city] || 'from-slate-500 to-slate-700'} rounded-xl p-5 text-white text-center card-hover flex flex-col items-center justify-center min-h-[90px]`}
            >
              <span className="font-semibold text-sm">{city}</span>
            </Link>
          ))}
        </div>

        {/* View All Cities Button */}
        <div className="text-center">
          <Link
            href="/cities/"
            title="Explore all cities across Pakistan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f2b3d] hover:bg-[#1a3f57] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            View All Cities
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Explore {CITIES.length}+ cities across Pakistan
          </p>
        </div>
      </div>
    </section>
  )
}
