'use client'

import Link from 'next/link'
import { Building2, MapPin, Phone, MessageCircle, Star } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import * as Icons from '@/components/ui/icons'

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
  isFeatured?: boolean
}

interface FeaturedBusinessesSectionProps {
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

export default function FeaturedBusinessesSection({ businesses }: FeaturedBusinessesSectionProps) {
  if (businesses.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50" aria-labelledby="featured-businesses-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-600 bg-amber-100 rounded-full mb-3">
            <Star className="w-3 h-3" />
            FEATURED
          </span>
          <h2 id="featured-businesses-heading" className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
            Featured Businesses
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Discover premium businesses handpicked for quality and excellence
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
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-amber-200 hover:shadow-xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full relative"
              >
                {/* Featured Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                </div>

                {/* Header with Logo */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 flex items-center justify-center min-h-24">
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={`${business.businessName} logo`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: category?.color || '#f59e0b' }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Business Info */}
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-2 group-hover:text-amber-600 transition-colors">
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
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors shadow-sm"
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
                    href={business.slug ? `/${business.slug}` : `/business/${business.id}`}
                    className="block w-full text-center px-4 py-2.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200 hover:border-amber-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/featured-businesses"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Featured Businesses
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
