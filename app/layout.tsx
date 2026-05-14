import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import AntiCopyWrapper from '@/components/anti-copy-wrapper'
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button'
import dynamic from 'next/dynamic'

// ─── next/font: zero render-blocking, automatic font-display:swap, self-hosted ──
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  // Only the weights actually used in the design system
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

// ─── Lazy-load heavy client widgets — they are NOT needed for first paint ───────
const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  ssr: false,
  loading: () => null,
})

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Find Local Businesses & Services – PakBizBranches',
  description:
    'Pakistan\'s trusted free business directory. Find verified local businesses, phone numbers, and addresses by city and category. 15,000+ listings across 150+ cities. List your business free.',
  keywords:
    'Pakistan business directory, free business listing Pakistan, Karachi business listings, Lahore business directory, Islamabad business listings, local services Pakistan, business phone numbers Pakistan, companies in Pakistan by city, verified business contacts Pakistan, WhatsApp business directory Pakistan',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online/' }],
  metadataBase: new URL('https://pakbizbranhces.online/'),
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Pakistan Business Directory | Find Local Businesses & Services – PakBizBranches',
    description:
      'Search verified Pakistan businesses by category and city. 15,000+ listings across 150+ cities. Find phone numbers, addresses & WhatsApp contacts — free on PakBizBranches.',
    url: 'https://pakbizbranhces.online/',
    siteName: 'PakBizBranches',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pakistan Business Directory | Find Local Businesses & Services',
    description:
      'List your business for free and get discovered by thousands of local customers across Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <meta name="google-site-verification" content="D2TTC8ZWjbjA3wgOFcyrfBnFkjC3TAiCG7E6wDxDGK4" />
        <link rel="alternate" hrefLang="en-PK" href="https://pakbizbranhces.online/" />
        <link rel="alternate" hrefLang="x-default" href="https://pakbizbranhces.online/" />

        {/* Preconnect to Firebase (Firestore data) and Google APIs */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* Google Analytics — loaded after page is interactive to avoid TBT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H1R80X5ZVE', { send_page_view: true });
              // Defer GA script load until after LCP
              (function() {
                function loadGA() {
                  var s = document.createElement('script');
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-H1R80X5ZVE';
                  s.async = true;
                  document.head.appendChild(s);
                }
                if (document.readyState === 'complete') {
                  setTimeout(loadGA, 0);
                } else {
                  window.addEventListener('load', function() { setTimeout(loadGA, 0); }, { once: true });
                }
              })();
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://pakbizbranhces.online/#organization',
              name: 'PakBizBranches',
              url: 'https://pakbizbranhces.online/',
              logo: 'https://pakbizbranhces.online/logo-img.png',
              description: 'Pakistan\'s trusted free business directory with 15,000+ verified listings. No registration required. Helps users find local businesses by city and category and allows business owners to add their local citations for free.',
              sameAs: [
                'https://facebook.com/pakbizbranches',
                'https://twitter.com/pakbizbranches',
                'https://instagram.com/pakbizbranches',
                'https://linkedin.com/company/pakbizbranches'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@pakbizbranhces.online',
                telephone: '+923142552851',
                areaServed: {
                  '@type': 'Country',
                  name: 'Pakistan'
                }
              },
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Gulghast Colony, Urdu Bazar',
                addressLocality: 'Multan',
                addressRegion: 'Punjab',
                addressCountry: 'PK'
              },
              areaServed: {
                '@type': 'Country',
                name: 'Pakistan'
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://pakbizbranhces.online/#website',
              name: 'PakBizBranches',
              url: 'https://pakbizbranhces.online/',
              description: 'Pakistan\'s trusted free business directory with 15,000+ verified listings. No registration required. Find local businesses by city and category with WhatsApp details. Add your business free.',
              publisher: {
                '@id': 'https://pakbizbranhces.online/#organization'
              },
              inLanguage: 'en-PK',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://pakbizbranhces.online/categories/?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://pakbizbranhces.online/#localbusiness',
              name: 'PakBizBranches Business Directory',
              url: 'https://pakbizbranhces.online/',
              telephone: '+923345636230',
              description: 'Free Pakistan business directory service connecting local businesses with customers',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Gulghast Colony, Urdu Bazar',
                addressLocality: 'Multan',
                addressRegion: 'Punjab',
                addressCountry: 'PK'
              },
              serviceType: 'Business Directory Service',
              areaServed: {
                '@type': 'Country',
                name: 'Pakistan'
              }
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AntiCopyWrapper />
        <FloatingWhatsAppButton />
        <ChatWidget />
        {children}
      </body>
    </html>
  )
}
