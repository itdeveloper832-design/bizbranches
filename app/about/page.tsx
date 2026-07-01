import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Target, Users, Globe, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About PakBizBranches: Local Business Directory',
  description: 'Learn about PakBizBranches, the free Pakistan business directory helping users find verified local businesses, contact details, and services across cities.',
  keywords: 'about PakBizBranches, Pakistan business directory mission, free business listing Pakistan, local business platform Pakistan, trusted business directory Pakistan',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/about/',
  },
}

const values = [
  {
    Icon: Target,
    title: 'Our Mission',
    desc: 'To connect every Pakistani business with local customers, making commerce easier, faster, and more transparent across the country.',
    color: '#60a5fa',
  },
  {
    Icon: Users,
    title: 'Who We Serve',
    desc: 'We serve small businesses, enterprises, and entrepreneurs across all cities of Pakistan, helping them get discovered online for free.',
    color: '#10b981',
  },
  {
    Icon: Globe,
    title: 'Our Reach',
    desc: 'With verified listings and growing monthly visitors, PakBizBranches is one of Pakistan\'s most trusted free business directories.',
    color: '#f59e0b',
  },
  {
    Icon: Award,
    title: 'Our Promise',
    desc: 'We promise free, fast, and fair listings for every business. Quality over quantity, every listing is reviewed before going live.',
    color: '#ef4444',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0f2b3d] py-20" aria-labelledby="about-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="about-heading" className="text-4xl md:text-5xl font-bold text-white text-balance">
              About PakBizBranches: Pakistan&apos;s Free Business Directory
            </h1>
            <p className="mt-5 text-white/65 text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
              We built PakBizBranches to solve a real problem. Millions of great Pakistani businesses were invisible online, while customers struggled to find local services. Our free directory changes that.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-5">Our Story</h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>
                PakBizBranches was founded with a simple but powerful idea. Every business in Pakistan deserves a digital presence, regardless of its size or budget. Millions of local businesses were invisible online, while customers struggled to find the right services in their cities.
              </p>
              <p>
                We built a platform that is completely free for businesses to list themselves. It has a clean and easy to use interface for customers to search and discover. From restaurants in Karachi to tech firms in Islamabad, from textile manufacturers in Faisalabad to healthcare providers in Lahore, our directory covers it all.
              </p>
              <p>
                Our platform targets local needs in major business hubs. In Lahore, we map shops in Gulberg III, Liberty Market, DHA Phase 5, and Hall Road. In Karachi, we list offices in Clifton Block 5, Tariq Road, Shahrah e Faisal, and the SITE Area. In Islamabad and Rawalpindi, we cover businesses in the Blue Area, G 9 Markaz, and Murree Road near Gordon College.
              </p>
              <p>
                We also connect directory profiles to official verification sources. Business owners can add their FBR NTN or reference their Securities and Exchange Commission of Pakistan filings. Highlighting membership with the Lahore Chamber of Commerce and Industry or the Karachi Chamber of Commerce and Industry further builds trust with prospective customers.
              </p>
              <p>
                Today, with thousands of verified business listings across Pakistan and thousands of daily visitors, we are proud to be one of Pakistan&apos;s most trusted free business directories. And we are just getting started.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Identity & EEAT Upgrades */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">Corporate Identity & Leadership</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>PakBizBranches</strong> is operated as an independent business directory and local search citation service designed specifically for the Pakistani market. We are committed to transparency and accuracy.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
                <div>
                  <h4 className="font-bold text-[#0f2b3d] mb-2">Our Leadership</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Lead Founder:</strong> Muhammad Usman Butt</li>
                    <li><strong>Co-Founder:</strong> Farhan Ahmed Siddiqui</li>
                    <li><strong>SEO & Technical Architect:</strong> Sana Fatima</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[#0f2b3d] mb-2">Corporate Information</h4>
                  <ul className="space-y-1 text-sm">
                    <li><strong>HQ Location:</strong> Gulghast Colony, Urdu Bazar, Multan, Punjab, Pakistan</li>
                    <li><strong>Email:</strong> support@pakbizbranhces.online</li>
                    <li><strong>Hotline:</strong> +92 314 2552851</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <h4 className="font-bold text-[#0f2b3d] mb-2">Directory Data Quality & Verification framework</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Every listing submitted to PakBizBranches is verified using an automated OTP check on the owner&apos;s mobile number. Additionally, our administrative team manually reviews each listing to check the listed shopfront/office photos and WhatsApp handles, ensuring dead contacts and duplicate profiles are kept off the platform. Verified listings receive our signature green <strong>Verified Badge</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[#f8fafc]" aria-labelledby="values-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="values-heading" className="text-2xl font-bold text-[#0f2b3d] text-center mb-10">
              What Drives Us
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map(({ Icon, title, desc, color }) => (
                <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover flex gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color + '1a' }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f2b3d] text-base">{title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-[#0f2b3d]">15,000+</div>
                <div className="text-sm text-gray-500 mt-1">Verified Business Listings</div>
              </div>
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-[#0f2b3d]">150+</div>
                <div className="text-sm text-gray-500 mt-1">Cities Covered</div>
              </div>
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-[#0f2b3d]">100%</div>
                <div className="text-sm text-gray-500 mt-1">Free to List</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0f2b3d] text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white">Ready to list your business?</h2>
            <p className="mt-3 text-white/60">Join thousands of businesses already growing on PakBizBranches. It&apos;s completely free.</p>
            <Link
              href="/add-business/"
              className="mt-6 inline-block px-8 py-3 bg-[#60a5fa] hover:bg-blue-400 text-white font-bold rounded-xl transition-colors text-sm"
            >
              Add Your Business Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

