import CityCategoryPage, { generateMetadata } from '@/app/businesses/[city]/[categorySlug]/page'

export { generateMetadata }

export default async function LocationsCategoryPage(props: { params: Promise<{ city: string; category: string }> }) {
  const params = await props.params
  return CityCategoryPage({ params: Promise.resolve({ city: params.city, categorySlug: params.category }) })
}

export const runtime = 'edge';
