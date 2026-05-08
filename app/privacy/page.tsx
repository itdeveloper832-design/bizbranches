import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PakBizBranches',
  description: 'Privacy policy for PakBizBranches Business Directory.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-[#0f2b3d] mb-8">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4">Last Updated: April 2026</p>
          <p className="mb-6">
            At PakBizBranches, we take your privacy seriously. This policy describes what information we collect and how we use it.
          </p>
          
          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you add a business listing, including business name, phone number, address, and description.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">2. How We Use Information</h2>
          <p className="mb-4">
            The information we collect is used to provide our business directory services, allowing users to find and contact businesses in Pakistan.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">3. Data Sharing</h2>
          <p className="mb-4">
            Business listing data is public. We do not sell your personal contact information to third parties.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">4. Cookies</h2>
          <p className="mb-4">
            We use cookies to improve your browsing experience and analyze site traffic.
          </p>

          <h2 className="text-xl font-bold text-[#0f2b3d] mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at support@pakbizbranches.online.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
