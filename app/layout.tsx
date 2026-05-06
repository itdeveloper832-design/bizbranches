import type { Metadata } from 'next'
import './globals.css'
import AntiCopyWrapper from '@/components/anti-copy-wrapper'
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button'
import ChatWidget from '@/components/chat/ChatWidget'

export const metadata: Metadata = {
  title: 'Pakistan Business Directory | Find Local Businesses & Services',
  description:
    'The most trusted Pakistan business directory. Find verified local businesses, phone numbers, and addresses by city and category. List your business for free.',
  keywords:
    'Pakistan business directory, free business listing Pakistan, Karachi business listings, Lahore business directory, Islamabad business listings, local services Pakistan, business phone numbers Pakistan, companies in Pakistan by city, verified business contacts Pakistan, WhatsApp business directory Pakistan',
  authors: [{ name: 'PakBizBranches', url: 'https://pakbizbranhces.online/' }],
  metadataBase: new URL('https://pakbizbranhces.online/'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Pakistan Business Directory | Find Local Businesses & Services',
    description:
      'Search verified Pakistan businesses by category and city. Compare listings and contact local services quickly on the #1 business directory.',
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
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="D2TTC8ZWjbjA3wgOFcyrfBnFkjC3TAiCG7E6wDxDGK4" />
        <link rel="alternate" hrefLang="en-PK" href="https://pakbizbranhces.online/" />
        <link rel="alternate" hrefLang="x-default" href="https://pakbizbranhces.online/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        
        {/* Google Analytics - Set your ID here to track traffic */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H1R80X5ZVE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H1R80X5ZVE');
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
              logo: 'https://pakbizbranhces.online/bizbranches.pk.png',
              description: 'Pakistan\'s #1 free business directory with 12,450+ listings. No registration required. Helps users find local businesses phone numbers by city and category and allows business owners to add their local citations for free.',
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
              description: 'Pakistan\'s #1 free business directory with 12,450+ listings. No registration required. Find local businesses phone numbers by city and category with WhatsApp details. Add your business free.',
              publisher: {
                '@id': 'https://pakbizbranhces.online/#organization'
              },
              inLanguage: 'en-PK',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://pakbizbranhces.online/categories?q={search_term_string}'
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
      <body className="font-sans antialiased" cz-shortcut-listen="true">
        <AntiCopyWrapper />
        <FloatingWhatsAppButton />
        <ChatWidget />
        {children}
      </body>
    </html>
  )
}
