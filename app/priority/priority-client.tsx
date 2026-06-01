'use client'

import { useState } from 'react'
import { Crown, Star, Zap, Shield, CheckCircle, ArrowRight, Phone, Mail, TrendingUp, Eye, Rocket } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { sendPriorityRequestEmail } from '@/lib/email-service'

export default function PriorityClient() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    currentListing: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('loading')

    try {
      await sendPriorityRequestEmail({
        businessName: formData.businessName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        currentListing: formData.currentListing,
        message: formData.message
      })

      setStatus('success')
      setFormData({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        city: '',
        currentListing: '',
        message: ''
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 5000)

    } catch (error) {
      console.error('Error sending priority request:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Priority Request Received!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your interest in priority listing. Our team will contact you within 24 hours to discuss the next steps.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-10 h-10 text-yellow-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Priority Business Listing
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get premium visibility and instant verification for your business. Stand out from the competition with our priority listing service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Priority Listing?</h2>
                <p className="text-gray-600 mb-8">
                  Elevate your business presence with premium features that drive more customers and boost your credibility.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Featured Placement</h3>
                    <p className="text-gray-600">Appear at the top of search results and category pages</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instant Verification</h3>
                    <p className="text-gray-600">Skip the waiting queue with immediate approval</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verified Badge</h3>
                    <p className="text-gray-600">Build trust with customers through verification</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Enhanced Visibility</h3>
                    <p className="text-gray-600">Get 10x more views than regular listings</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Priority Support</h3>
                    <p className="text-gray-600">Dedicated customer support for priority partners</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Analytics Dashboard</h3>
                    <p className="text-gray-600">Track views, contacts, and performance metrics</p>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Priority Listing</h3>
                  <Crown className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">₨4,999<span className="text-lg font-normal">/year</span></div>
                <p className="text-yellow-100 mb-4">One-time investment for 365 days of premium visibility</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Featured placement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Instant verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Analytics dashboard
                  </li>
                </ul>
              </div>
            </div>

            {/* Request Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Priority Listing</h2>
              
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                      errors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your business name"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                        errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.contactPerson && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+92 300 1234567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <CitySearchDropdown
                      value={formData.city}
                      onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                      placeholder="Select your city"
                      className={`w-full ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Listing URL (if any)
                  </label>
                  <input
                    type="url"
                    name="currentListing"
                    value={formData.currentListing}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    placeholder="https://www.pakbizbranhces.online/business/your-business"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Tell us why you want priority listing..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      Request Priority Listing
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Our team will contact you within 24 hours to complete your priority listing setup.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
