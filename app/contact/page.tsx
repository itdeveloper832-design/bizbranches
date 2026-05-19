import { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
  title: 'Contact PakBizBranches: Register Your Business Free',
  description: 'Get in touch with PakBizBranches. Submit feedback, report listings, or request help. Our support team is ready to assist your Pakistan business.',
  keywords: 'contact PakBizBranches, business directory support Pakistan, business listing help Pakistan, contact business directory Pakistan',
  alternates: {
    canonical: 'https://pakbizbranhces.online/contact/',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
