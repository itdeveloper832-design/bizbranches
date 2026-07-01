import { Metadata } from 'next'
import RestaurantsClient from './restaurants-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Restaurants in Pakistan: Food and Dining Directory',
  description: 'Browse verified restaurants across Pakistan. Get direct phone numbers, locations, and menus. Click to find top-rated dining spots on PakBizBranches.',
  keywords: 'Pakistan restaurants, food directory Pakistan, cafes Pakistan, dining Pakistan, restaurants near me Pakistan, food businesses Pakistan, restaurant contact details Pakistan',
}

export default function RestaurantsPage() {
  return <RestaurantsClient />
}

export const runtime = 'edge';
