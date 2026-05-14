import { Metadata } from 'next'
import AddBusinessClient from './add-business-client'

export const metadata: Metadata = {
  title: 'List Your Business Free in Pakistan | PakBizBranches Directory 2026',
  description:
    'Add your business to Pakistan\'s #1 free business directory. Reach thousands of local customers searching by city and category. No registration required. List free today.',
  keywords: 'list business free Pakistan, add business Pakistan directory, free business listing Pakistan, register business online Pakistan, business directory submission Pakistan',
  alternates: {
    canonical: 'https://pakbizbranhces.online/add-business/',
  },
}

export default function AddBusinessPage() {
  return <AddBusinessClient />
}
