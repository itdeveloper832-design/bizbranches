import { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
  title: 'Contact PakBizBranches | Pakistan Business Directory Support',
  description: 'Contact PakBizBranches for business listing support, partnerships, or queries. We help Pakistani businesses get discovered online. Reach us via WhatsApp, email, or our contact form.',
  keywords: 'contact PakBizBranches, business directory support Pakistan, business listing help Pakistan, contact business directory Pakistan',
  alternates: {
    canonical: 'https://pakbizbranhces.online/contact/',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
