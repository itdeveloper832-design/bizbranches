import Link from 'next/link'
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a1e2b] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6" title="PakBizBranches - Home">
              <img 
                src="/logo-img.jfif" 
                alt="PakBizBranches Logo" 
                className="w-10 h-10 object-contain rounded-md"
              />
              <span className="text-white font-bold text-xl tracking-tight">
                PakBiz<span className="text-[#60a5fa]">Branches</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Pakistan&apos;s leading free business directory. Find verified contacts, phone numbers, and addresses for businesses in 150+ cities nationwide.
            </p>
            <div className="flex gap-3 mb-8">
              {[
                { Icon: Facebook, label: 'Facebook', url: 'https://facebook.com/pakbizbranches' },
                { Icon: Twitter, label: 'Twitter', url: 'https://twitter.com/pakbizbranches' },
                { Icon: Instagram, label: 'Instagram', url: 'https://instagram.com/pakbizbranches' },
                { Icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/company/pakbizbranches' },
              ].map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#60a5fa] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4.5 h-4.5" />
                </a>
              ))}
            </div>
            <div className="space-y-3 pt-2">
               <address itemScope itemType="https://schema.org/PostalAddress" className="flex items-start gap-3 not-italic text-sm text-white/60">
                <MapPin className="w-5 h-5 text-[#60a5fa] shrink-0" />
                <span className="leading-tight">
                  <span itemProp="streetAddress">Gulghast Colony, Urdu Bazar</span>, <br />
                  <span itemProp="addressLocality">Multan</span>, <span itemProp="addressRegion">Punjab</span>, <span itemProp="addressCountry">PK</span>
                </span>
              </address>
              <a href="tel:+923345636230" className="flex items-center gap-3 text-sm text-white/60 hover:text-[#60a5fa] transition-colors" title="Call Us">
                <Phone className="w-5 h-5 text-[#60a5fa] shrink-0" />
                +92 334 563 6230
              </a>
              <a href="mailto:blogstech213@gmail.com" className="flex items-center gap-3 text-sm text-white/60 hover:text-[#60a5fa] transition-colors" title="Email Us">
                <Mail className="w-5 h-5 text-[#60a5fa] shrink-0" />
                blogstech213@gmail.com
              </a>
            </div>
          </div>

          {/* Directory Sections */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h3>
              <ul className="space-y-3.5 text-sm">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/categories/', label: 'Categories' },
                  { href: '/add-business/', label: 'Add Business' },
                  { href: '/blog/', label: 'Business Blog' },
                  { href: '/about/', label: 'About Us' },
                  { href: '/contact/', label: 'Contact Us' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors inline-block" title={label}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Top Sectors</h3>
              <ul className="space-y-3.5 text-sm">
                {[
                  { href: '/categories/restaurants/', label: 'Restaurants' },
                  { href: '/categories/real-estate/', label: 'Real Estate' },
                  { href: '/categories/healthcare/', label: 'Healthcare' },
                  { href: '/categories/technology/', label: 'Technology' },
                  { href: '/categories/retail/', label: 'Retail' },
                  { href: '/categories/automotive/', label: 'Automotive' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors inline-block" title={label}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden sm:block">
              <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Main Cities</h3>
              <ul className="space-y-3.5 text-sm">
                {[
                  { href: '/cities/karachi/', label: 'Karachi' },
                  { href: '/cities/lahore/', label: 'Lahore' },
                  { href: '/cities/islamabad/', label: 'Islamabad' },
                  { href: '/cities/rawalpindi/', label: 'Rawalpindi' },
                  { href: '/cities/faisalabad/', label: 'Faisalabad' },
                  { href: '/cities/multan/', label: 'Multan' },
                  { href: '/cities/peshawar/', label: 'Peshawar' },
                  { href: '/cities/sialkot/', label: 'Sialkot' },
                  { href: '/cities/hyderabad/', label: 'Hyderabad' },
                  { href: '/cities/quetta/', label: 'Quetta' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors inline-block" title={label}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="hidden sm:block">
              <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Guides</h3>
              <ul className="space-y-3.5 text-sm">
                {[
                  { href: '/blog/how-to-add-business/', label: 'Listing Guide' },
                  { href: '/blog/essential-resources-travel-business-pakistan/', label: 'Travel Guide' },
                  { href: '/blog/pakistan-business-landscape-2024/', label: '2024 Market' },
                  { href: '/blog/digital-presence-local-businesses-pakistan/', label: 'SEO for Small Biz' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-white/60 hover:text-[#60a5fa] transition-colors inline-block" title={label}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Local Search</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { href: '/locations/karachi/restaurants/', label: 'Restaurants Karachi' },
                { href: '/locations/lahore/real-estate/', label: 'Real Estate Lahore' },
                { href: '/locations/islamabad/technology/', label: 'IT Companies Islamabad' },
                { href: '/locations/karachi/healthcare/', label: 'Clinics Karachi' },
                { href: '/locations/lahore/beauty/', label: 'Beauty Lahore' },
                { href: '/locations/rawalpindi/automotive/', label: 'Auto Rawalpindi' },
                { href: '/locations/faisalabad/retail/', label: 'Retail Faisalabad' },
                { href: '/locations/multan/education/', label: 'Schools Multan' },
                { href: '/locations/sialkot/logistics/', label: 'Cargo Sialkot' },
                { href: '/locations/peshawar/travel/', label: 'Travel Peshawar' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:bg-[#60a5fa] hover:text-white hover:border-[#60a5fa] transition-all duration-300"
                  title={label}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-[#60a5fa]/10 border border-[#60a5fa]/20">
              <p className="text-xs text-[#60a5fa] font-semibold mb-1">List your business</p>
              <p className="text-[10px] text-white/40 mb-3">Join Pakistan&apos;s #1 free directory today.</p>
              <Link href="/add-business/" className="text-xs font-bold text-white hover:underline">Register Now &rarr;</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} <span className="text-white/60 font-semibold">PakBizBranches</span>. Built for Pakistan with 💙.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/privacy/" className="hover:text-white/80 transition-colors uppercase text-[10px] tracking-widest font-bold">Privacy</Link>
            <Link href="/terms/" className="hover:text-white/80 transition-colors uppercase text-[10px] tracking-widest font-bold">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-white/80 transition-colors uppercase text-[10px] tracking-widest font-bold">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
