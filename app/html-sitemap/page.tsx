import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CATEGORIES, CITIES } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sitemap: Find Businesses in All Cities of Pakistan',
  description: 'Browse all cities, categories, and business directories on PakBizBranches. Find verified phone numbers and local services across Pakistan easily.',
  alternates: { canonical: 'https://www.pakbizbranhces.online/html-sitemap/' },
  robots: { index: true, follow: true },
}

const STATIC_PAGES = [
  { href: '/', label: 'Home' },
  { href: '/categories/', label: 'All Categories' },
  { href: '/cities/', label: 'All Cities' },
  { href: '/add-business/', label: 'Add Your Business Free' },
  { href: '/featured-businesses/', label: 'Featured Businesses' },
  { href: '/blog/', label: 'Business Blog' },
  { href: '/about/', label: 'About Us' },
  { href: '/contact/', label: 'Contact Us' },
  { href: '/privacy/', label: 'Privacy Policy' },
  { href: '/terms/', label: 'Terms of Service' },
]

const TIER1_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Gujranwala', 'Sialkot', 'Hyderabad', 'Abbottabad']

export default function HtmlSitemapPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#f8fafc] min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#0f2b3d] mb-2">HTML Sitemap</h1>
          <p className="text-gray-500 mb-10">Complete directory of all pages on PakBizBranches.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Static Pages */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4 pb-2 border-b border-gray-100">Main Pages</h2>
              <ul className="space-y-2">
                {STATIC_PAGES.map(p => (
                  <li key={p.href}>
                    <Link href={p.href} className="text-[#60a5fa] hover:underline text-sm">{p.label}</Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Categories */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4 pb-2 border-b border-gray-100">Business Categories</h2>
              <ul className="space-y-2">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/categories/${cat.id}/`} className="text-[#60a5fa] hover:underline text-sm">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tier 1 Cities */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4 pb-2 border-b border-gray-100">Major Cities</h2>
              <ul className="space-y-2">
                {TIER1_CITIES.map(city => (
                  <li key={city}>
                    <Link href={`/cities/${city.toLowerCase().replace(/ /g, '-')}/`} className="text-[#60a5fa] hover:underline text-sm">{city} Business Directory</Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* City + Category combinations for Tier 1 */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2 lg:col-span-3">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4 pb-2 border-b border-gray-100">Popular Local Searches</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {TIER1_CITIES.slice(0, 6).flatMap(city =>
                  CATEGORIES.map(cat => (
                    <Link
                      key={`${city}-${cat.id}`}
                      href={`/locations/${city.toLowerCase().replace(/ /g, '-')}/${cat.id}/`}
                      className="text-xs text-[#60a5fa] hover:underline leading-tight"
                    >
                      {cat.name} in {city}
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* All Cities */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2 lg:col-span-3">
              <h2 className="text-lg font-bold text-[#0f2b3d] mb-4 pb-2 border-b border-gray-100">All Cities in Pakistan</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {CITIES.map(city => (
                  <Link
                    key={city}
                    href={`/cities/${city.toLowerCase().replace(/ /g, '-')}/`}
                    className="text-xs text-[#60a5fa] hover:underline"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

