import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Calendar, ArrowRight, Building2, Clock, User, Star } from 'lucide-react'
import { BLOG_POSTS, FEATURED_POSTS, RECENT_POSTS } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Business Blog Pakistan | Tips, Guides & Growth Strategies – PakBizBranches',
  description: 'Read expert business tips, growth guides, and local market insights for Pakistani entrepreneurs. Updated 2026 — marketing strategies, SEO advice, and success stories.',
  keywords: 'Pakistan business blog, business growth tips Pakistan, small business advice Pakistan, marketing strategies Pakistan, entrepreneur guide Pakistan 2026',
  alternates: {
    canonical: 'https://pakbizbranhces.online/blog/',
  },
  openGraph: {
    title: 'Business Blog Pakistan | Tips, Guides & Growth Strategies – PakBizBranches',
    description: 'Read expert business tips and growth guides for Pakistani entrepreneurs. Marketing strategies and local business advice.',
    url: 'https://pakbizbranhces.online/blog/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#60a5fa]/10 text-[#60a5fa] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Blog & Resources
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Business Tips & Guides
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Expert advice, tips, and guides to help your business grow and succeed in Pakistan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-2 bg-[#60a5fa] text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors inline-flex items-center justify-center gap-2"
              >
                Back to Homepage
              </Link>
              <Link
                href="/add-business"
                className="px-6 py-2 bg-white/10 text-white border border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-flex items-center justify-center"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">Latest Articles</h2>
              <p className="text-gray-600 text-lg">
                Discover insights and strategies to grow your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.filter(post => !post.hidden).slice(0, 15).map((post, index) => (
                <article
                  key={post.slug}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    post.featured ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div className="p-6 md:p-8">
                    {post.featured && (
                      <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-[#0f2b3d] mb-3 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-[#60a5fa] hover:text-blue-600 font-semibold text-sm transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to List Your Business?
              </h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Join thousands of Pakistani businesses and reach more customers. It's completely free!
              </p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 bg-[#60a5fa] hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
              >
                Add Your Business Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
