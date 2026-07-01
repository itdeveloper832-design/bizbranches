import { Metadata } from 'next'
import DeveloperClient from './developer-client'

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Developer Notes: PakBizBranches Technical Documentation',
  description: 'Read the technical architecture and database design notes of the PakBizBranches directory. Learn about our React, Next.js, and Firebase setup.',
  keywords: 'PakBizBranches developer, Next.js Pakistan, Firebase business directory, React Pakistan, business directory API, technical documentation Pakistan',
}

export default function DeveloperPage() {
  return <DeveloperClient />
}

export const runtime = 'edge';
