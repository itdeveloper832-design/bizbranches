import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantsClient from '@/components/category/restaurants-client'

export const metadata: Metadata = {
  title: 'Best Restaurants in Pakistan: Top Dining Spots',
  description: 'Discover the best restaurants and food spots in Pakistan. Get verified phone numbers, food menus, and WhatsApp locations for free.',
  keywords: 'restaurants Pakistan, best dining spots, food spots Pakistan, cafe Karachi, Lahore restaurants, Islamabad dining places',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/category/restaurants/',
  },
}

export default function RestaurantsPage() {
  return (
    <>
      <Navbar />
      <RestaurantsClient />
      <Footer />
    </>
  )
}

