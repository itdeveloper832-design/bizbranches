import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import * as Icons from '@/components/ui/icons'

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

export default function CategoriesGrid() {
  return (
    <section className="py-16 bg-white" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-slate-800 text-balance">
            Browse by Category
          </h2>
          <p className="mt-3 text-slate-600 text-lg">
            Explore thousands of businesses across popular categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const IconComponent = categoryIcons[cat.id]
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}/`}
                title={`Find ${cat.name} in Pakistan`}
                className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-3 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                >
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm leading-tight">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.count.toLocaleString()} listings</p>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/categories/"
            title="Explore all business categories in Pakistan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors duration-200"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}
