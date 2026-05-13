import { Metadata } from 'next'
import AddBusinessClient from './add-business-client'

export const metadata: Metadata = {
  title: 'List Your Business for Free | PakBizBranches',
  description:
    'Add your business to Pakistan business directory for free. Reach local customers with category and city based discovery.',
}

export default function AddBusinessPage() {
  return <AddBusinessClient />
}
