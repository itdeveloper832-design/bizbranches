import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Upload, Phone, MessageCircle, Globe, Facebook, MapPin, Building2, Star, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Add Your Business: PakBizBranches Listing Guide',
  description: 'Learn how to list your business on Pakistan\'s free directory. Follow our step-by-step guide to add your company and get more local customers.',
  keywords: 'add business Pakistan, list business free Pakistan, business listing guide, local SEO Pakistan, submit business directory',
  alternates: {
    canonical: 'https://pakbizbranches.online/blog/how-to-add-business/',
  },
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0f2b3d] to-[#1a3f57] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#60a5fa]/10 text-[#60a5fa] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 className="w-4 h-4" />
              Business Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              How to Add Your Business to PakBizBranches
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              A complete step-by-step guide to list your business on Pakistan's fastest-growing business directory
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">Why List Your Business on PakBizBranches?</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                PakBizBranches is Pakistan's leading online business directory, connecting thousands of customers with local businesses across 150+ cities. Listing your business is completely free and helps you:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <Users className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-[#0f2b3d] mb-2">Reach More Customers</h3>
                  <p className="text-gray-600 text-sm">Get discovered by thousands of potential customers searching for businesses like yours</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-[#0f2b3d] mb-2">Boost Your Visibility</h3>
                  <p className="text-gray-600 text-sm">Improve your online presence and rank higher in local search results</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <Star className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-[#0f2b3d] mb-2">Build Trust</h3>
                  <p className="text-gray-600 text-sm">Establish credibility with a professional business listing</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#0f2b3d] mb-8">Step-by-Step Business Submission Guide</h2>
              
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#60a5fa] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0f2b3d] mb-3">Basic Business Information</h3>
                    <p className="text-gray-600 mb-4">Start with the essential details about your business:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Business Name:</strong> Your official business name as it appears on registrations
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Contact Person:</strong> The main person customers should contact (optional but recommended)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Email Address:</strong> Professional email for customer inquiries (optional)
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Pro Tip:</strong> Use a professional email address (e.g., info@yourbusiness.com) rather than personal email accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#60a5fa] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0f2b3d] mb-3">Contact Information</h3>
                    <p className="text-gray-600 mb-4">Provide reliable ways for customers to reach you:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-[#60a5fa] shrink-0" />
                        <div>
                          <strong className="text-gray-800">Phone Number:</strong> 10-digit Pakistani mobile number (e.g., 3001234567)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600 shrink-0" />
                        <div>
                          <strong className="text-gray-800">WhatsApp Number:</strong> Same 10-digit format, must be unique for each business
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 mt-4 border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Phone numbers must be exactly 10 digits. Don't include +92 or 0 prefix in the form.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#60a5fa] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0f2b3d] mb-3">Location & Category</h3>
                    <p className="text-gray-600 mb-4">Help customers find you by specifying your location and business type:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Country:</strong> Automatically set to Pakistan
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">City:</strong> Select from 150+ Pakistani cities
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Complete Address:</strong> Full street address with landmarks
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-purple-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Category:</strong> Main business category (e.g., Restaurants, Healthcare)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-purple-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Sub-Category:</strong> Specific niche (e.g., Fast Food, Dental Clinic)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#60a5fa] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0f2b3d] mb-3">Business Details</h3>
                    <p className="text-gray-600 mb-4">Showcase what makes your business special:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Business Description:</strong> 500-1000 characters detailing your products, services, and unique value
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Business Logo:</strong> High-quality logo in JPG, PNG, WebP, or SVG format (max 2.5MB)
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 mt-4 border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Writing Tips:</strong> Include your years of experience, specializations, what makes you unique, and call-to-action for customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#60a5fa] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0f2b3d] mb-3">Digital Presence</h3>
                    <p className="text-gray-600 mb-4">At least one digital presence is required to verify your business:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Website URL:</strong> Your business website (optional)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-700 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Facebook Page:</strong> Your business Facebook page (optional)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                          <strong className="text-gray-800">Google Business Profile:</strong> Your Google Business listing (optional)
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-red-700 shrink-0" />
                        <div>
                          <strong className="text-gray-800">YouTube Channel:</strong> Your business YouTube channel (optional)
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 mt-4 border border-orange-200">
                      <p className="text-sm text-orange-800">
                        <strong>Requirement:</strong> At least one of these fields must be filled to complete your submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
              <h2 className="text-2xl font-bold text-[#0f2b3d] mb-6">What Happens After Submission?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#0f2b3d] mb-1">Instant Approval</h3>
                    <p className="text-gray-600">Your business goes live immediately after submission</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#0f2b3d] mb-1">SEO-Friendly URL</h3>
                    <p className="text-gray-600">Get a clean URL like yourbusiness-city.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#0f2b3d] mb-1">Customer Inquiries</h3>
                    <p className="text-gray-600">Start receiving calls and messages from potential customers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#0f2b3d] mb-1">Free Updates</h3>
                    <p className="text-gray-600">Update your business information anytime at no cost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-[#0f2b3d] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Ready to List Your Business?</h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Join thousands of Pakistani businesses already benefiting from increased visibility and customer reach.
              </p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 bg-[#60a5fa] hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
              >
                Add Your Business Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-white/60 text-sm">
                100% Free • No Hidden Charges • Instant Approval
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
