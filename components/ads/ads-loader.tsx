'use client'

// Client wrapper — ssr:false is only valid inside a Client Component.
// Server pages import these wrappers instead of the ad components directly.
import dynamic from 'next/dynamic'

const BannerAdDynamic = dynamic(() => import('@/components/ads/banner-ad'), {
  ssr: false,
  loading: () => null,
})

const NativeAdDynamic = dynamic(() => import('@/components/ads/native-ad'), {
  ssr: false,
  loading: () => null,
})

type BannerVariant = 'inline' | 'sidebar' | 'sticky-mobile'

interface BannerAdLoaderProps {
  variant?: BannerVariant
  className?: string
}

export function BannerAdLoader({ variant = 'inline', className }: BannerAdLoaderProps) {
  return <BannerAdDynamic variant={variant} className={className} />
}

export function NativeAdLoader() {
  return <NativeAdDynamic />
}
