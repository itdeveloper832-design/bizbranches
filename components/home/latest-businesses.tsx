'use client'

import Link from 'next/link'
import { Building2, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import * as Icons from '@/components/ui/icons'
import NativeAd from '@/components/ads/native-ad'

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address?: string
  category: string
  description: string
  logoUrl?: string
  slug?: string
  createdAt?: any
  status: string
}

interface LatestBusinessesProps {
  businesses: Business[]
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'restaurants': Icons.RestaurantIcon,
  'real-estate': Icons.RealEstateIcon,
  'technology': Icons.TechnologyIcon,
  'healthcare': Icons.HealthcareIcon,
  'education': Icons.EducationIcon,
  'retail': Icons.RetailIcon,
  'construction': Icons.ConstructionIcon,
  'automotive': Icons.AutomotiveIcon,
  'finance': Icons.FinanceIcon,
  'travel': Icons.TravelIcon,
  'beauty': Icons.BeautyIcon,
  'logistics': Icons.LogisticsIcon,
}

export default function LatestBusinesses({ businesses }: LatestBusinessesProps) {
  if (businesses.length === 0) {
    return (
      <section className="py-16 bg-white" aria-labelledby="latest-businesses-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="latest-businesses-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Latest Businesses
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              No businesses available yet. Be the first to list your business!
            </p>
            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl mt-6"
            >
              Add Your Business Now
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white" aria-labelledby="latest-businesses-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
            NEWLY ADDED
          </span>
          <h2 id="latest-businesses-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
            Latest Businesses
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Discover recently listed businesses across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business) => {
            const category = CATEGORIES.find(c => c.id === business.category)
            const IconComponent = category ? categoryIcons[category.id] : Building2
            const whatsappUrl = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}` : null

            return (
              <div
                key={business.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Header with Logo */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center min-h-24">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={`${business.businessName} logo`}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: category?.color || '#3b82f6' }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Business Info */}
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {business.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{business.city}</span>
                    </div>
                    {category && (
                      <span 
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                    {business.description}
                  </p>

                  {/* Phone Display */}
                  <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span className="font-medium">{business.phone}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-3">
                    <a
                      href={`tel:${business.phone}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Chat
                      </a>
                    )}
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={`/business/${business.slug}/`}
                    className="block w-full text-center px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-200 hover:border-blue-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Native ad rendered AFTER all 8 latest businesses */}
        <NativeAd />

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            View All Businesses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
