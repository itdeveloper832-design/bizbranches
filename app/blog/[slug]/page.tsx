import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { BLOG_POSTS } from '@/lib/blog-data'

const BASE_URL = 'https://pakbizbranhces.online'

export const revalidate = 86400 // revalidate once per day

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Article Not Found | PakBizBranches' }

  const title = `${post.title} – Business Blog`
  const description = post.excerpt?.substring(0, 160) || 'Read this business guide on PakBizBranches blog.'
  const url = `${BASE_URL}/blog/${params.slug}`

  return {
    title,
    description,
    keywords: (post.keywords || post.tags || []).slice(0, 8).join(', '),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PakBizBranches',
      locale: 'en_PK',
      type: 'article',
      authors: [post.author],
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const pageUrl = `${BASE_URL}/blog/${params.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'PakBizBranches',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-img.png` },
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    image: `${BASE_URL}/logo-img.png`,
    keywords: (post.keywords || post.tags || []).join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: pageUrl },
    ],
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#60a5fa] transition-colors">Home</Link></li>
              <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
              <li><Link href="/blog" className="hover:text-[#60a5fa] transition-colors">Blog</Link></li>
              <li><ChevronRight className="w-4 h-4 text-gray-400" /></li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{post.title}</li>
            </ol>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Hero Banner */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] flex items-center justify-center px-8 text-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-[#60a5fa]/20 text-[#60a5fa] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {post.category}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-8 md:p-12">
              <div
                className="prose prose-lg max-w-none prose-headings:text-[#0f2b3d] prose-a:text-[#60a5fa] prose-strong:text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {(post.keywords || post.tags || []).map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-[#60a5fa] rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-[#0f2b3d] mb-1">About the Author: {post.author}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.author} is a seasoned business strategist and digital marketing expert with over 12 years of experience in the Pakistani startup ecosystem. 
                    Specializing in local SEO and business growth, Alex has helped hundreds of small businesses in Karachi, Lahore, and Islamabad establish 
                    a dominant online presence. As the lead editor at PakBizBranches, Alex focuses on providing actionable insights for local entrepreneurs.
                  </p>
                </div>
              </div>

              {/* Related Posts — topically matched by category first */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-[#0f2b3d] mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {(() => {
                    const sameCat = BLOG_POSTS.filter(p => p.slug !== post.slug && !p.hidden && p.category === post.category)
                    const fallback = BLOG_POSTS.filter(p => p.slug !== post.slug && !p.hidden && p.category !== post.category)
                    const related = [...sameCat, ...fallback].slice(0, 2)
                    return related.map(related => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}/`}
                        className="group bg-gray-50 rounded-xl p-5 hover:bg-blue-50 transition-colors border border-gray-100"
                      >
                        <div className="text-xs text-[#60a5fa] font-semibold mb-2">{related.category}</div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#60a5fa] transition-colors leading-tight">
                          {related.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{related.excerpt}</p>
                        <div className="flex items-center gap-1 mt-3 text-[#60a5fa] text-sm font-medium">
                          Read more <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Homepage Link */}
          <div className="mt-12 bg-gradient-to-r from-[#0f2b3d] to-[#1a3f57] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Grow Your Business?</h3>
            <p className="text-white/80 mb-8 text-lg">Join thousands of businesses already listed on PakBizBranches. Get discovered by local customers searching for your services.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/add-business"
                className="px-8 py-3 bg-[#60a5fa] text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg"
              >
                Add Your Business Free
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <span className="text-gray-400 hidden sm:block">•</span>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-[#60a5fa] font-medium hover:underline"
            >
              Home
            </Link>
            <span className="text-gray-400 hidden sm:block">•</span>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 text-[#60a5fa] font-medium hover:underline"
            >
              Browse Businesses
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
