import { Metadata } from 'next'
import PriorityClient from './priority-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Priority Business Listing: PakBizBranches Pakistan',
  description: 'Get priority business listing on PakBizBranches. Access featured placement, instant verification, and premium visibility across Pakistan cities.',
  keywords: 'priority business listing Pakistan, featured business Pakistan, premium business directory Pakistan, business promotion Pakistan, priority listing Pakistan',
}

export default function PriorityPage() {
  return <PriorityClient />
}
