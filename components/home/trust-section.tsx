import { CheckCircle2, ShieldCheck, Zap, Users } from 'lucide-react'

const features = [
  {
    title: "Verified Listings",
    description: "Our team manually reviews and verifies business contact details and addresses to ensure accuracy.",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />
  },
  {
    title: "Trusted by Thousands",
    description: "Join over 15,000 businesses and thousands of daily users who trust PakBizBranches for local search.",
    icon: <Users className="w-8 h-8 text-blue-500" />
  },
  {
    title: "Secure & Private",
    description: "We protect your data and ensure that all business communications are secure and legitimate.",
    icon: <ShieldCheck className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Lightning Fast",
    description: "Search and discover local businesses in seconds with our optimized mobile-first directory.",
    icon: <Zap className="w-8 h-8 text-amber-500" />
  }
]

export default function TrustSection() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0f2b3d] mb-4">Why Trust PakBizBranches?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are dedicated to building Pakistan's most reliable and transparent business directory, 
            connecting customers with verified local services every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f2b3d] mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Mock Trust Badges */}
          <div className="flex items-center gap-2 font-bold text-gray-400">
            <span className="text-2xl">🛡️</span> SECP Verified
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-400">
            <span className="text-2xl">✅</span> 100% Free
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-400">
            <span className="text-2xl">📍</span> Local Support
          </div>
          <div className="flex items-center gap-2 font-bold text-gray-400">
            <span className="text-2xl">⭐</span> Top Rated
          </div>
        </div>
      </div>
    </section>
  )
}
