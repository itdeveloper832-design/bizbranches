import { Metadata } from 'next'
import AddBusinessClient from './add-business-client'

export const metadata: Metadata = {
  title: 'Add Business: List Your Pakistan Business Free Now',
  description:
    'Submit your business to Pakistan\'s leading free directory. Reach local customers, add contact info, and get verified instantly on PakBizBranches.',
  keywords: 'list business free Pakistan, add business Pakistan directory, free business listing Pakistan, register business online Pakistan, business directory submission Pakistan',
  alternates: {
    canonical: 'https://pakbizbranches.online/add-business/',
  },
}

export default function AddBusinessPage() {
  return <AddBusinessClient />
}
