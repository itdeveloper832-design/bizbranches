import Link from 'next/link'
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a1e2b] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg
                width="32"
                height="24"
                viewBox="0 0 40 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-6"
              >
                {/* Building icon */}
                <g>
                  <rect x="8" y="4" width="24" height="16" fill="#60a5fa" rx="2"/>
                  <rect x="3" y="5" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="5" y="5" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="1" y="7.5" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="3" y="7.5" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="5" y="7.5" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="1" y="10" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="3" y="10" width="1.5" height="1.5" fill="#ffffff"/>
                  <rect x="5" y="10" width="1.5" height="1.5" fill="#ffffff"/>
                  {/* Door */}
                  <rect x="3.5" y="13" width="1" height="1" fill="#ffffff"/>
                </g>
                {/* Location pin icon */}
                <g transform="translate(32, 8)">
                  <circle cx="3" cy="3" r="2" fill="#60a5fa"/>
                  <circle cx="3" cy="3" r="0.8" fill="#ffffff"/>
                  <path d="M3,5 C3,5 3,6 3,6" stroke="#60a5fa" stroke-width="0.8" fill="none"/>
                </g>
              </svg>
              <span className="text-white font-bold text-xl">
                PakBiz<span className="text-[#60a5fa]">Branches</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Pakistan&apos;s most trusted online business directory. Connecting customers with local businesses across every city.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: 'Facebook', url: 'https://facebook.com/pakbizbranches' },
                { Icon: Twitter, label: 'Twitter', url: 'https://twitter.com/pakbizbranches' },
                { Icon: Instagram, label: 'Instagram', url: 'https://instagram.com/pakbizbranches' },
                { Icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/pakbizbranches' },
              ].map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#60a5fa] transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/categories', label: 'All Categories' },
                { href: '/add-business', label: 'Add Business Free' },
                { href: '/blog', label: 'Blog & Resources' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/developer', label: 'Developer Notes' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Top Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/categories/restaurants', label: 'Restaurants & Food' },
                { href: '/categories/real-estate', label: 'Real Estate' },
                { href: '/categories/technology', label: 'Technology & IT' },
                { href: '/categories/healthcare', label: 'Healthcare' },
                { href: '/categories/education', label: 'Education' },
                { href: '/categories/retail', label: 'Retail & Shopping' },
                { href: '/categories/automotive', label: 'Automotive' },
                { href: '/categories/beauty', label: 'Beauty & Wellness' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse by City */}
          <div>
            <h3 className="font-semibold text-white mb-4">Browse by City</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/cities/karachi', label: 'Karachi' },
                { href: '/cities/lahore', label: 'Lahore' },
                { href: '/cities/islamabad', label: 'Islamabad' },
                { href: '/cities/rawalpindi', label: 'Rawalpindi' },
                { href: '/cities/faisalabad', label: 'Faisalabad' },
                { href: '/cities/multan', label: 'Multan' },
                { href: '/cities/peshawar', label: 'Peshawar' },
                { href: '/cities/quetta', label: 'Quetta' },
                { href: '/cities/sialkot', label: 'Sialkot' },
                { href: '/cities/hyderabad', label: 'Hyderabad' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact + Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-white/50 mb-6">
            <address itemScope itemType="https://schema.org/PostalAddress" className="flex items-center gap-2 not-italic">
              <MapPin className="w-4 h-4 text-[#60a5fa]" />
              <span itemProp="streetAddress">Gulghast Colony, Urdu Bazar</span>, <span itemProp="addressLocality">Multan</span>, <span itemProp="addressRegion">Punjab</span>
            </address>
            <a href="tel:+923345636230" className="flex items-center gap-2 hover:text-[#60a5fa] transition-colors">
              <Phone className="w-4 h-4 text-[#60a5fa]" />
              +92 334 563 6230
            </a>
            <a href="mailto:blogstech213@gmail.com" className="flex items-center gap-2 hover:text-[#60a5fa] transition-colors">
              <Mail className="w-4 h-4 text-[#60a5fa]" />
              blogstech213@gmail.com
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} PakBizBranches. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
